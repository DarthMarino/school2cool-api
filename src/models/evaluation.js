const mongoose = require('mongoose')

const evaluationSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: true
    },
    deliverable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Deliverable'
    },
}, {
    timestamps: true
})

const Evaluation = mongoose.model('Evaluation', evaluationSchema)

module.exports = Evaluation