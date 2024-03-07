import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import createError from 'http-errors';

const signTokenPromiseBased = promisify(jwt.sign);
const verifyTokenPromiseBased = promisify(jwt.verify);

export function signAccessToken(userId) {
    try {
        return signTokenPromiseBased({}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
            issuer: 'mohammed.aldaragily@gmail.com',
            audience: userId,
        });
    }
    catch(err) {
        console.log(err);
        throw createError.InternalServerError();
    }
};

export function signRefreshToken(userId) {
    try {
        return signTokenPromiseBased({}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1y',
            issuer: 'mohammed.aldaragily@gmail.com',
            audience: userId,
        });
    }
    catch(err) {
        console.log(err);
        throw createError.InternalServerError();
    }
};

export function verifyAccessToken(token) {
    try { return verifyTokenPromiseBased(token, process.env.ACCESS_TOKEN_SECRET); }
    catch(err) {
        console.log(err);
        throw createError.InternalServerError();
    }
};

export function verifyRefreshToken(token) {
    try { return verifyTokenPromiseBased(token, process.env.REFRESH_TOKEN_SECRET); }
    catch(err) {
        console.log(err);
        throw createError.InternalServerError();
    }
};