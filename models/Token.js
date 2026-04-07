const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'serving', 'completed', 'expired'],
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
    expectedWaitTime: {
        type: Number, //in minutes
    },
    positionInQueue: {
        type: Number,
    },
    rejoinWindowExpiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);