const mongoose = require('mongoose')

const deliverableSchema = new mongoose.Schema({
    file: {
        type: Buffer,
        required: true,
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    missedPointsDelay: {
        type: Number,
    }
}, {
    timestamps: true
})

const Deliverable = mongoose.model('Deliverable', deliverableSchema)

module.exports = Deliverable