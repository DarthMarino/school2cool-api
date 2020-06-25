const mongoose = require('mongoose')

const documentTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const DocumentType = mongoose.model('DocumentType', documentTypeSchema)

module.exports = DocumentType