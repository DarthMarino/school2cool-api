const mongoose = require('mongoose')

const formatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const Format = mongoose.model('Format', formatSchema)

module.exports = Format