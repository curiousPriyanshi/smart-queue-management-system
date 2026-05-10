/**
 * @swagger
 * tags:
 *   name: Queue
 *   description: Queue management APIs
 */

/**
 * @swagger
 * /api/queue:
 *   post:
 *     summary: Create a new queue
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: OPD Queue
 *               avg_service_time:
 *                 type: number
 *                 example: 10
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Queue created successfully
 *       400:
 *         description: Invalid queue data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/queue/{id}/toggle:
 *   put:
 *     summary: Pause or resume a queue
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Queue ID
 *     responses:
 *       200:
 *         description: Queue status updated successfully
 *       404:
 *         description: Queue not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/queue/{id}:
 *   delete:
 *     summary: Delete or deactivate a queue
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Queue ID
 *     responses:
 *       200:
 *         description: Queue deleted successfully
 *       404:
 *         description: Queue not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

const express = require('express');
const router = express.Router();
const { createQueue, updateQueue, toggleQueueStatus, getAllQueues, getQueue, getQueueTokens, deleteQueue } = require('../controllers/queueController');
const {authorizeRole} = require('../middleware/roleMiddleware');
const {protect} = require('../middleware/authMiddleware');


router.post('/',protect,authorizeRole('superadmin'), createQueue); //create new queue
router.put('/:id',protect,authorizeRole('superadmin'), updateQueue);
router.put('/:id/toggle',protect,authorizeRole('superadmin'), toggleQueueStatus);
router.delete('/:id',protect,authorizeRole('superadmin'), deleteQueue);
router.get('/', protect, authorizeRole('superadmin'), getAllQueues);
router.get('/:id',protect,authorizeRole('superadmin', 'counterAdmin'), getQueue);
router.get('/:id/tokens',protect,authorizeRole('superadmin', 'counterAdmin'), getQueueTokens);

module.exports = router;