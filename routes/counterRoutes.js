/**
 * @swagger
 * tags:
 *   name: Counter
 *   description: Counter management APIs
 */

/**
 * @swagger
 * /api/counter:
 *   post:
 *     summary: Create a new counter
 *     tags: [Counter]
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
 *               - queueId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Counter 1
 *               queueId:
 *                 type: string
 *                 example: 664a8f9bc12d4f0012345678
 *               assigned_admin_id:
 *                 type: string
 *                 example: 664a8f9bc12d4f0011111111
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Counter created successfully
 *       400:
 *         description: Invalid counter data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/counter/{id}/toggle:
 *   put:
 *     summary: Activate or deactivate a counter
 *     tags: [Counter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Counter ID
 *     responses:
 *       200:
 *         description: Counter status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Counter not found
 */

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