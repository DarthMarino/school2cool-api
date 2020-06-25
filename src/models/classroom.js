const mongoose = require('mongoose')

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Classroom = mongoose.model('Classroom', classroomSchema)

module.exports = Classroom