const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

userSchema.statics.signup = async function(name, email, password) {
    if(!name || !email || !password) {
        throw Error('Please fill in all the fields!');
    }

    if(!validator.isEmail(email)) {
        throw Error('Invalid email!');
    }

    if(!validator.isStrongPassword(password)) {
        throw Error("Password isn't strong enough!");
    }

    const exists = await this.findOne({email});

    if(exists) {
        throw Error('This email is already in use!');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({name, email, password: hash});

    return user
}

userSchema.statics.login = async function(email, password) {
    if(!email || !password) {
        throw Error('Please fill in all the fields!');
    }

    if(!validator.isEmail(email)) {
        throw Error('Invalid email!');
    }

    const user = await this.findOne({email});

    if(!user) {
        throw Error('This email is not linked to any account!');
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        throw Error('Password is incorrect!');
    }

    return user
}

userSchema.statics.updateEmail = async function(email, password, userId) {
    if(!email || !password) {
        throw Error('Please fill in all the fields!');
    }

    if(!validator.isEmail(email)) {
        throw Error('Invalid email!');
    }

    const exists = await this.findOne({email});

    if(exists) {
        throw Error('This email is already in use!');
    }

    const user = await this.findOneAndUpdate({_id: userId}, {email}, {new: true});

    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        throw Error('Password is incorrect!');
    }

    return user
}

module.exports = mongoose.model('User', userSchema)