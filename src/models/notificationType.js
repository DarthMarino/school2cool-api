const mongoose = require('mongoose')

const notificationTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    }
}, {
    timestamps: true
})

const NotificationType = mongoose.model('NotificationType', notificationTypeSchema)

module.exports = NotificationType