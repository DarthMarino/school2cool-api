const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    resolved: {
        type: Boolean,
        default: false
    },
    deliverable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Deliverable'
    },
    reviewDetails: [
        {
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
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        }
    ]
}, {
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review