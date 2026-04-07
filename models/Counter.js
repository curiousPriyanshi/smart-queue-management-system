const mongoose = require('mongoose');
const counterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    queueID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Queue',
        required:true,

    },
    assignedAdmin:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'User',
         required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, {timestamps:true});
module.exports = mongoose.model('Counter', counterSchema);
