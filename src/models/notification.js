const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    read: {
        type: Boolean,
        default: false,
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Classroom'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification