const express = require('express');
const router = express.Router();
const { createQueue, updateQueue, toggleQueueStatus, deactivateQueue, getAllQueues, getQueue, getQueueTokens } = require('../controllers/queueController');
const {authorizeRole} = require('../middleware/roleMiddleware');
const {protect} = require('../middleware/authMiddleware');


router.post('/',protect,authorizeRole('superadmin'), createQueue); //create new queue
router.put('/:id',protect,authorizeRole('superadmin'), updateQueue);
router.put('/:id/toggle',protect,authorizeRole('superadmin'), toggleQueueStatus);
router.delete('/:id',protect,authorizeRole('superadmin'), deactivateQueue);
router.get('/', protect, authorizeRole('superadmin'), getAllQueues);
router.get('/:id',protect,authorizeRole('superadmin', 'counteradmin'), getQueue);
router.get('/:id/tokens',protect,authorizeRole('superadmin', 'counteradmin'), getQueueTokens);

module.exports = router;