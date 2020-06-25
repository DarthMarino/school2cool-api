const mongoose = require('mongoose')

const documentSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    minExtension: {
        type: Number,
    },
    maxExtension: {
        type: Number,
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    }
}, {
    timestamps: true
})

const DocumentSection = mongoose.model('DocumentSection', documentSectionSchema)

module.exports = DocumentSection