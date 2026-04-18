const Queue = require('../models/Queue');
const Token = require('../models/Token');
const createQueue = async(req, res)=>{
    try{
        const {name} = req.body;
        const newQueue = new Queue({name, createdBy: req.user.id});
        await newQueue.save();
        res.status(201).json({ success: true, message: "Queue created successfully", queue: newQueue });
    }catch(err){
        res.status(500).json({success:false, message:"Server error"});
    }
}
const updateQueue = async(req, res)=>{
    try{
        const {id} = req.params;
        const {name} = req.body;
        const queue = await Queue.findByIdAndUpdate(id, {name}, {new: true});
        if(!queue){
            return res.status(404).json({ success: false, message: "Queue not found" });
        }
        res.status(200).json({ success: true, message: "Queue updated successfully", queue });

    }catch(err){
         res.status(500).json({success:false, message:"Server error"});
    }
}

const deactivateQueue = async(req, res)=>{
    try{
        const {id} = req.params;
        const queue = await Queue.findById(id);
        if(!queue){
            return res.status(404).json({ success: false, message: "Queue not found" });
        }
        queue.isActive = false;
        await queue.save();
        res.status(200).json({ success: true, message: "Queue deactivated successfully" });
    }catch(err){
         res.status(500).json({success:false, message:"Server error"});
    }
}
const getAllQueues = async(req, res)=>{
    try{
        const queues = await Queue.find();
        res.status(200).json({ success: true, queues });
    }catch(err){
         res.status(500).json({success:false, message:"Server error"});
    }
}
const getQueue = async(req, res)=>{
    try{
        const {id} = req.params;
        const queue = await Queue.findById(id);
        if(!queue){
            return res.status(404).json({ success: false, message: "Queue not found" });
        }
        //predicted wait time logic left
        res.status(200).json({ success: true, queue });
    }catch(err){
         res.status(500).json({success:false, message:"Server error"});
    }
}
const getQueueTokens = async(req, res)=>{
    try{
        const {id} = req.params;
        const tokens = await Token.find({queueID : id});
    //     if(!tokens || tokens.length === 0){
    //         return res.status(404).json({ success: false, message: "tokens not found" });
    // }
       res.status(200).json({ success: true, count: tokens.length, tokens });
}catch(err){
        res.status(500).json({success:false, message:"Server error"});
    }
}
const toggleQueueStatus = async(req, res)=>{
    try{
        const {id} = req.params;
        const queue = await Queue.findById(id);
        if(!queue){
            return res.status(404).json({ success: false, message: "Queue not found" });
        }
        queue.isActive = !queue.isActive;
        await queue.save();
        res.status(200).json({ success: true, message: `Queue ${queue.isActive ? 'activated' : 'deactivated'} successfully` });
    }catch(err){
        res.status(500).json({success:false, message:"Server error"});
    }
}
module.exports = { createQueue, updateQueue, toggleQueueStatus, deactivateQueue, getAllQueues, getQueue, getQueueTokens };