const Token = require('../models/Token');
const User = require('../models/User');
const Queue = require('../models/Queue');
const ServiceLog = require('../models/ServiceLog');

const STATUS = {
  WAITING : 'waiting',
  SERVING : 'serving',
  COMPLETED : 'completed',
  MISSED : 'missed',
  CANCELLED : 'cancelled',
  EXPIRED : 'expired',
  AWAY : 'away'
}


// for : customer (join queue and create token)
const createToken = async(req, res)=>{
    try{
        const {queueId} = req.params;
        const queue = await Queue.findById(queueId);
        if(!queue || !queue.isActive){
            return res.status(404).json({
              success:false,
              message:"Queue not found or inactive"
            })
        }
        //if user already has waiting token
        const existingToken = await Token.findOne({
          customerID : req.user.id,
          queueID : queueId,
          status : {
            $in : [
              STATUS.WAITING,
              STATUS.SERVING,
              STATUS.AWAY,
              STATUS.MISSED
            ]
          }
        })
        if(existingToken) {
          return res.status(400).json({
            success:false,
            message : "You already have an active token"
          })
        }
        queue.currentTokenNumber += 1;
        await queue.save();
        
        const newToken = new Token({
            tokenNumber: queue.currentTokenNumber,
            status: STATUS.WAITING,
            customerID: req.user.id,
            queueID: queueId,
        })
        await newToken.save();
        res.status(201).json({success:true, data:newToken})
    }
    catch(err){
            res.status(500).json({success:false, message:"Server error"});
    }
}    

//role : customer (get details + live position + ETA)
const getToken = async(req, res)=>{
    try{
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId)
      .populate("customerID", "name phone")
      .populate("queueID", "name avgServiceTime");

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found"
      });
    }

    let positionInQueue = null;
    let expectedWaitTime = null;

    if ([STATUS.WAITING, STATUS.MISSED, STATUS.AWAY].includes(token.status)) {
      const aheadCount = await Token.countDocuments({
        queueID: token.queueID._id,
        status: STATUS.WAITING,
        createdAt: { $lt: token.createdAt }
      });

      positionInQueue = aheadCount + 1;
      expectedWaitTime = aheadCount * (token.queueID.avgServiceTime || 5); // default to 5 mins if not set
    }

    const tokenObj = token.toObject();
    tokenObj.positionInQueue = positionInQueue;
    tokenObj.expectedWaitTime = expectedWaitTime;

    res.status(200).json({
      success: true,
      data: tokenObj
    });
    }
    catch(err){
            res.status(500).json({success:false, message:"Server error"});
    }
}    

//role : counteradmin (call next oldest waiting token)
const callNextToken = async(req, res)=>{
    try {
    const { queueId } = req.params;

    //serve only one token at a time
    const alreadyServingToken = await Token.findOne({
      queueID : queueId,
      status : STATUS.SERVING
    });
    if(alreadyServingToken){
      return res.status(400).json({
        status:false,
        message : 'One token is already being served'
      })
    }

    //oldest waiting token first
    const token = await Token.findOne({
      queueID: queueId,
      status: STATUS.WAITING
    }).sort({ createdAt: 1 });

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'No waiting token found'
      });
    }

    token.status = 'serving';
    token.calledAt = new Date();

    await token.save();

    res.status(200).json({
      success: true,
      data: token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

//role:counteradmin (mark token service completed)
const completeToken = async(req, res)=>{
    try{
        const {tokenId} = req.params;
        const token = await Token.findById(tokenId);
        if(!token){
            return res.status(404).json({success:false, message:"Token not found"})
        }
        if(token.status !== STATUS.SERVING){ 
          return res.status(404).json({success:false, message:"Only serving tokens can be marked as completed"})
        }
        token.status = STATUS.COMPLETED;
        token.completedAt = new Date();

       await token.save();
       //store analytics log
       const log = new ServiceLog({
        tokenID : tokenId,
        counterId : req.user.id,
        actualWaitTime : (token.calledAt - token.createdAt)/1000/60,
        actualServiceTime : (token.completedAt - token.calledAt)/1000/60
       })
       await log.save();
       res.status(200).json({success:true, data:token})
       await Token.findByIdAndDelete(tokenId); //remove completed token from active tokens collection
    }
    catch(err){
            res.status(500).json({success:false, message:"Server error"});
    }
}    

//role : counteradmin (mark token as missed if customer did not show up within rejoin window after being called)
const markMissedToken = async(req, res)=>{
    try{
        const {tokenId} = req.params;
        const token = await Token.findById(tokenId);
        if(!token){
            return res.status(404).json({success:false, message:"Token not found"})
        }
        if(token.status !== STATUS.SERVING){ 
          return res.status(404).json({success:false, message:"Only serving tokens can be marked as missed"})
        }
        token.status = STATUS.MISSED;
        token.rejoinWindowExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await token.save();
        res.status(200).json({success:true, data:token})
    }
    catch(err){
            res.status(500).json({success:false, message:"Server error"});
    }
}    

//role : customer (if missed and time not expired then rejoin)
// statuschanges from missed -> waiting
const rejoinToken = async(req, res)=>{
  try{
    const {tokenId} = req.params;
    const token = await Token.findById(tokenId);

    if(!token){
        return res.status(404).json({success:false, message:"Token not found"})
    }

    if(token.status != STATUS.MISSED){
      return res.status(400).json({
        success:false,
        message : 'Only missed tokens can rejoin'
      })
    }

    //if time expired
    if(!token.rejoinWindowExpiresAt || token.rejoinWindowExpiresAt < new Date()){
      token.status = STATUS.EXPIRED;
      await token.save();
      return res.status(400).json({
        success:false,
        message : 'Rejoin window expired'
      })
    }
    token.status = STATUS.WAITING;
    token.rejoinWindowExpiresAt = null;
    await token.save();
    res.status(200).json({success:true, data:token})
  }catch(err){
    res.status(500).json({success:false, message:"Server error"});
  }
}

//role : cutomer (temporarily step away from queue)
const markAway = async(req, res)=>{
  try{
    const {tokenId} = req.params;
    const token = await Token.findById(tokenId);

    if(!token){
        return res.status(404).json({success:false, message:"Token not found"})
    }

    if(token.status != STATUS.WAITING){
      return res.status(400).json({
        status : false,
        message : 'Only waiting tokens can step away'
      })
    }
    token.status = STATUS.AWAY;
    await token.save();
    return res.status(200).json({ success: true, data: token });

  }catch(err){
    res.status(500).json({
      success:false,
      messsage : "Server error"
    })
  }
}

//role : customer (back from away status to waiting)
const backFromAway = async(req, res)=>{
  try{
    const {tokenId} = req.params;
    const token = await Token.findById(tokenId);

    if(!token){
        return res.status(404).json({success:false, message:"Token not found"})
    }

    if(token.status != STATUS.AWAY){
      return res.status(400).json({
        success:false,
        message : 'Only tokens that are away can rejoin the queue'
      })
    }
    token.status = STATUS.WAITING;
    await token.save();
    res.status(200).json({success:true, data:token})

  }catch(err){
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

//role:customer (cancel token if they no longer want to wait or are leaving)
const cancelToken = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId);

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: 'Token not found' });
    }

    if(token.customerID.toString() !== req.user.id.toString()){
      return res.status(403).json({
        status:false,
        message:"Unauthorized"
      })
    }
    if(token.status == STATUS.SERVING){
      return res.status(400).json({
        status : false,
        message : "Serving tokens cannot be cancelled"
      })
    }
    token.status = STATUS.CANCELLED;

    await token.save();

    res.status(200).json({
      success: true,
      data: token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { createToken, getToken, callNextToken, completeToken, markMissedToken, rejoinToken, markAway,backFromAway, cancelToken };