import User from '../models/user.js';
import { isValidObjectId } from 'mongoose';
import patterns from '../helpers/patterns.js';

import createError from 'http-errors';

export function checkId(req, res, next) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            res.status(404);
            return next(new Error('Bad Request: Invalid Object ID.'));
        }
        return next();
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
}

export function checkEmail(req, res, next) {
    try {
        const { body } = req;
        const isValidEmail = patterns.email.test(body.email);
        if (!isValidEmail) {
            res.status(404);
            return next(new Error('Bad Request: Invalid Email.'));
        }
        return next();
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
}

export async function checkName(req, res, next) {
    try {
        const { body } = req;
        const isValidName = patterns.name.test(body.firstName) && patterns.name.test(body.lastName);
        if (!isValidName) {
            res.status(404);
            return next(new Error('Bad Request: Invalid Name.'));
        }
        return next();
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
}

export async function checkBirthDate(req, res, next) {
    try {
        const { birthDate } = req.body;
        const date = new Date(birthDate);
        if (isNaN(date.valueOf())) {
            res.status(404);
            return next(new Error('Bad Request: Invalid Date Format.'));
        }
        return next();
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
}

export async function checkPassword(req, res, next) {
    try {
        const { body } = req;
        const isValidPassword = patterns.password.test(body.password);
        if (!isValidPassword) {
            res.status(404);
            return next(new Error('Bad Request: Invalid Password.'));
        }
        return next();
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
}

export function checkImage(req, res, next) {
    try {
        const { file } = req;
        if (!(file)) throw createError.BadRequest('Invalid Image.');
        return next();
    }
    catch (err) {
        return next(err);
    }
}