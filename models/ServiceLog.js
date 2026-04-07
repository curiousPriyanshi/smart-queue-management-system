const mongoose = require('mongoose');

const serviceLogSchema = new mongoose.Schema({
    tokenID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Token'
    },
    counterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Counter'
    },
    actualWaitTime:{
        type:Number //in minutes
    },
    actualServiceTime:{
        type:Number //in minutes
    },
}, {timestamps:true});
module.exports = mongoose.model('ServiceLog', serviceLogSchema);