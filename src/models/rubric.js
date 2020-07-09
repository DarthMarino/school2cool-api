const mongoose = require('mongoose')

const rubricSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    minScore: {
        type: Number,
        required: true,
        default: 0
    },
    maxScore: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    evaluativeCriteria: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            weight: {
                type: Number,
                required: true
            },
            evaluativeCriteriaDetail: [
                {
                    score: {
                        type: Number,
                        required: true
                    },
                    qualityDefinition:{
                        type: String,
                        required: true,
                        maxlength: 50
                    }
                }
            ]
        }
    ]
}, {
    timestamps: true
})

const Rubric = mongoose.model('Rubric', rubricSchema)

module.exports = Rubric