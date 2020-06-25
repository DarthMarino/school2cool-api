const mongoose = require('mongoose')

const evaluativeCriterionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rubric: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rubric'
    }
}, {
    timestamps: true
})

const EvaluativeCriterion = mongoose.model('EvaluativeCriterion', evaluativeCriterionSchema)

module.exports = EvaluativeCriterion