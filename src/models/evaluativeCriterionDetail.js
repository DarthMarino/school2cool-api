const mongoose = require('mongoose')

const evaluativeCriterionDetailSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true,
    },
    qualityDefinition: {
        type: String,
        required: true,
        maxlength: 50
    },
    evaluativeCriterion: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EvaluativeCriterion'
    }
}, {
    timestamps: true
})

const EvaluativeCriterionDetail = mongoose.model('EvaluativeCriterionDetail', evaluativeCriterionDetailSchema)

module.exports = EvaluativeCriterionDetail