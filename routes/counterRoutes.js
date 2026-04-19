const express = require('express');
const router = express.Router();
const { createCounter, updateCounter, toggleCounter, getAllCounters, getCounter } = require('../controllers/counterController');
const {authorizeRole} = require('../middleware/roleMiddleware');
const {protect} = require('../middleware/authMiddleware');


router.post('/',protect,authorizeRole('superadmin'), createCounter); //create new queue
router.put('/:id',protect,authorizeRole('superadmin', 'counterAdmin'), updateCounter);
router.put('/:id/toggle',protect,authorizeRole('superadmin'), toggleCounter);
router.get('/', protect, authorizeRole('superadmin'), getAllCounters);
router.get('/:id',protect,authorizeRole('superadmin', 'counterAdmin'), getCounter);


module.exports = router;