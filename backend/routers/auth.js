import { Router } from 'express';

import User from '../models/user.js';
import upload from '../middlewares/file-upload.js';
import { signAccessToken, signRefreshToken } from '../helpers/token.js';
import { loginSchema, userSchema } from '../helpers/validation-schema.js';
import { checkImage } from '../middlewares/validations.js';
import registered from '../middlewares/registered.js';
import createError from 'http-errors';
import { verifyRefreshTokenMW } from '../middlewares/verify-token.js';
import { client } from '../helpers/redis-connection.js';

const auth = Router();

auth.post(
    '/register',
    upload.single('profile_picture'),
    registered,
    checkImage,
    async (req, res, next) => {
        try {
            const { body, file } = req;
            const joi = await userSchema.validateAsync(body);
            const user = new User({
                firstName: joi.firstName,
                lastName: joi.lastName,
                birthDate: joi.birthDate,
                email: joi.email,
                password: joi.password,
                image: `/assets/images/${file.filename}`
            });
            await user.save();
            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);
            try { await client.SET(user.id, refreshToken, { EX: 365 * 24 * 60 * 60 }); }
            catch (err) {
                console.log(err.message);
                throw createError.InternalServerError();
            }
            return res.send({ accessToken, refreshToken });
        }
        catch (err) {
            return next(err);
        }
    });

auth.post('/login', async (req, res, next) => {
    try {
        const joi = await loginSchema.validateAsync(req.body);
        const user = await User.findOne({ email: joi.email });
        if (!user) return next(createError.Unauthorized(`${joi.email} is not registered.`));
        const match = user.isMatchPassword(joi.password);
        if (!match) return next(createError.Unauthorized('incorrect password.'));
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        try { await client.SET(user.id, refreshToken, { EX: 365 * 24 * 60 * 60 }); }
        catch (err) {
            console.log(err.message);
            throw createError.InternalServerError();
        }
        res.send({ accessToken, refreshToken });
    }
    catch (err) { return next(err); }
});

auth.post('/refresh-token', verifyRefreshTokenMW, async (req, res, next) => {
    try {
        const userId = req.payload.aud;
        const accessToken = await signAccessToken(userId);
        const refreshToken = await signRefreshToken(userId);
        try { await client.SET(userId, refreshToken, { EX: 365 * 24 * 60 * 60 }); }
        catch (err) {
            console.log(err.message);
            throw createError.InternalServerError();
        }
        return res.send({ accessToken, refreshToken });
    }
    catch (err) {
        return next(err);
    }
});

auth.delete('/logout', verifyRefreshTokenMW, async (req, res, next) => {
    const userId = req.payload.aud;
    try { await client.DEL(userId); }
    catch (err) {
        console.log(err.message);
        throw createError.InternalServerError();
    }
    res.sendStatus(204);
});

export default auth;