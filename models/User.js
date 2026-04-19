const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        match:[/^\d{10}$/, "Phone number must be 10 digits"]
    },
    password:{
        type:String,
        required:true,
        select: false
    },
    role:{
        type:String,
        enum:['customer', 'counterAdmin', 'superadmin'],
        default:'customer'
    },
    customerID:{
        type:String,
        unique:true
    },
    currentTokenID:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Token', 
        default:null
    }
}, {timestamps:true}); //automatically adds createdAt and updatedAt fields  

module.exports = mongoose.model('User', UserSchema);