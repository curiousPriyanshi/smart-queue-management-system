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