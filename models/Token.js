const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'away', 'serving', 'completed', 'missed', 'expired', 'cancelled'],
        default: 'waiting',
        required: true
    },
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    queueID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Queue',
        required: true
    },
    rejoinWindowExpiresAt: {
        type: Date,
    },
    calledAt: { type: Date },
    completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);