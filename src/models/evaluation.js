const mongoose = require('mongoose')

const evaluationSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
    },
    deliverable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Deliverable'
    },
    evaluativeCriteriaDetail: [
        {
            evaluativeCriterionDetail: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            }
        }
    ],
    grade: {
        type: Number
    }
}, {
    timestamps: true
})

const Evaluation = mongoose.model('Evaluation', evaluationSchema)

module.exports = Evaluation