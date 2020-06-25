const mongoose = require('mongoose')

const reviewDetailSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    attachment: {
        type: Buffer,
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Review'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const ReviewDetail = mongoose.model('ReviewDetail', reviewDetailSchema)

module.exports = ReviewDetail