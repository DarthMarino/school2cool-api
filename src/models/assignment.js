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
    delayTimeUnit: {
        type: String
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
        type: String,
        required: true
    },
    documentType: {
        type: String,
        required: true
    },
    rubric: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rubric'
    },
    documentSections: [
        {
            name: {
                type: String,
                required: true
            },
            minExtension: {
                type: Number
            },
            maxExtension: {
                type: Number
            }
        },
    ],
    bannedSources: [
        {
            source: {
                type: String,
                required: true
            }
        }
    ],
    learningObjectives: [
        {
            objective: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment