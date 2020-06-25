const mongoose = require('mongoose')

const evaluationDetailSchema = new mongoose.Schema({
    evaluation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Evaluation'
    },
    evaluativeCriterionDetail: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EvaluativeCriterionDetail'
    },
}, {
    timestamps: true
})

const EvaluationDetail = mongoose.model('Evaluation', evaluationDetailSchema)

module.exports = EvaluationDetail