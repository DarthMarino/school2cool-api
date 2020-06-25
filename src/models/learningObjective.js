const mongoose = require('mongoose')

const learningObjectiveSchema = new mongoose.Schema({
    objective: {
        type: String,
        required: true,
        trim: true,
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    }
}, {
    timestamps: true
})

const LearningObjective = mongoose.model('LearningObjective', learningObjectiveSchema)

module.exports = LearningObjective