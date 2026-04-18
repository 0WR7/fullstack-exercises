const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    name: {
        type: String,
        required: true,
    },
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            minlength: 3,
        },
    ],
})

userSchema.set('toJSON', {
    transform: (document, returnedOject) => {
        returnedOject.id = returnedOject._id.toString()
        delete returnedOject._id
        delete returnedOject.__v
        delete returnedOject.passwordHash
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User
