const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }   
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw Error('The password is not secure')
            }
        }
    },
    description: {
        type: String,
        trim: true,
    },
    picture: {
        type: Buffer,
    },
    active: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    const user = this
    // if the password was changed, then it must be encrypted
    // This verification is to avoid hashing a password already hashed
    if (user.isModified("password")) {
        // this will run if: the user is created or the password field is updated
        user.password = await bcrypt.hash(user.password, 8)
        ///TODO: save '8' in envs ?
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
     ///TODO: change 'SECRET_ENVS' for a secret phrase and save it in envs
    const token = await jwt.sign({_id: user._id.toString()}, 'SECRET_ENVS')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('unable to login');
        
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('unable to login')
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User