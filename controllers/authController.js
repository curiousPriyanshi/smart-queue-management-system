const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

const register = async (req, res) => {
    try {
        const { name, phone, password, role } = req.body;
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);//bcrypt.hash(password, saltRounds)
        const count = await User.countDocuments();
        const customerID = `${role === 'customer' ? 'CUST' : role === 'counterAdmin' ? "ADMN" : "SUPR"}-${String(count + 1).padStart(4, '0')}`;
        const newUser = new User({ name, phone, password: hashedPassword, role, customerID });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User successfully registered",
            user: {
                id: customerID,
                phone: newUser.phone,
                role: newUser.role
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' });
    }
}


const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(user._id, user.role);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                phone: user.phone,
                role: user.role
            }
        });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}
const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const logout = async(req, res)=>{
        res.status(200).json({ success: true, message: "User logged out successfully" });
}
module.exports = { generateToken, register, login, getMe, logout };