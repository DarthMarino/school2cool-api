const mongoose = require('mongoose')

const bannedSourceSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
        trim: true
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    }
}, {
    timestamps: true
})

const BannedSource = mongoose.model('BannedSource', bannedSourceSchema)

module.exports = BannedSource