const mongoose = require('mngoose');

const queueSchema = new mmongoose.Schema({
    name:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    avgServiceTime:{
        type:Number,
        default:5 //in minutes
    },
    currentTokenNumber:{
        type:Number,
        default:0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});
module.exports = mongoose.model('Queue', queueSchema);