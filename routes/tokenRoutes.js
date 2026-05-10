
/**
 * @swagger
 * tags:
 *   name: Token
 *   description: Token management APIs
 */

/**
 * @swagger
 * /api/queue/{queueId}/token:
 *   post:
 *     summary: Join a queue and generate token
 *     tags: [Token]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Queue ID
 *     responses:
 *       201:
 *         description: Token created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Queue not found
 */

/**
 * @swagger
 * /api/queue/{queueId}/token/callnext:
 *   patch:
 *     summary: Call next token in queue
 *     tags: [Token]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Queue ID
 *     responses:
 *       200:
 *         description: Next token called successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Queue or token not found
 */

/**
 * @swagger
 * /api/token/{tokenId}/complete:
 *   patch:
 *     summary: Mark token as completed
 *     tags: [Token]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID
 *     responses:
 *       200:
 *         description: Token marked as completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Token not found
 */
const express = require('express');
const { createToken, getToken, callNextToken, completeToken, markMissedToken, rejoinToken, markAway,backFromAway, cancelToken } = require('../controllers/tokenController')
const {authorizeRole} = require('../middleware/roleMiddleware');
const {protect} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/queue/:queueId/token', protect, createToken)
router.get('/token/:tokenId', protect, getToken)
router.patch('/queue/:queueId/token/callnext', protect, authorizeRole("counterAdmin"), callNextToken)
router.patch('/token/:tokenId/rejoin', protect, rejoinToken)
router.patch('/token/:tokenId/complete', protect, authorizeRole("counterAdmin"), completeToken)
router.patch('/token/:tokenId/missed', protect, authorizeRole("counterAdmin"), markMissedToken)
router.patch('/token/:tokenId/away', protect, authorizeRole("customer"), markAway)
router.patch('/token/:tokenId/back', protect, backFromAway)
router.patch('/token/:tokenId/cancel', protect, authorizeRole("customer"), cancelToken)


module.exports = router;