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
    }
}, {
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review