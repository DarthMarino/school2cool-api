const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
    openingDate: {
        type: Date,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    deadline: {
        type: Date,
    },
    baseScore: {
        type: Number,
        required: true,
    },
    missedPointsDelay: {
        type: Number,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    context: {
        type: String,
        required: true,
        trim: true
    },
    estimatedTime: {
        type: Number,
    },
    minReferences: {
        type: Number,
    },
    comment: {
        type: String,
        trim: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Classroom'
    },
    format: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Format'
    },
    documentType: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'DocumentType'
    },
    rubric: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rubric'
    }
}, {
    timestamps: true
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment