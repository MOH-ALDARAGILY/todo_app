import { model, Schema } from 'mongoose';
import confirmBirthDateValidator from '../helpers/birth-date-validator.js';

import hashPassword from '../helpers/hash.js';
import { compare } from 'bcrypt';
import createError from 'http-errors';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        validate: confirmBirthDateValidator
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function(next) {
    try {
        this.password = await hashPassword(this.password);
        return next();
    }
    catch(err) {
        console.log(err)
        return next(createError.InternalServerError());
    }
});

UserSchema.methods.isMatchPassword = function(password) {
    try { return compare(password, this.password); }
    catch(err) {
        console.log(err)
        throw createError.InternalServerError();
    }
}

const User = model('user', UserSchema);

export default User;