const express = require('express');
const router = express.Router();
const { register, login, getMe, logout} = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware')

router.post('/register', register); //public route
router.post('/login', login);   //public route
router.get('/me', protect, getMe);   //protected route, requires auth middleware to verify loggedIn or not
router.post('/logout', protect, logout); ////protected route, requires auth middleware to verify loggedIn or not

module.exports = router;