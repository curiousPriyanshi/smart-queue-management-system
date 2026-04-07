const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    phone:{
        type:String,
        required:true,
        unique:true,
        match:[/^\d{10}$/, "Phone number must be 10 digits"]
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['customer', 'admin', 'superadmin'],
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