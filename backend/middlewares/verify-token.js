import { verifyAccessToken, verifyRefreshToken } from '../helpers/token.js';
import { client } from '../helpers/redis-connection.js';
import createError from 'http-errors';

export async function verifyAccessTokenMW(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) return next(createError.Unauthorized());
        const bearerToken = authorization.split(' ');
        const token = bearerToken[1];
        const payload = await verifyAccessToken(token);
        req.payload = payload;
        return next();
    }
    catch (err) {
        switch (err.name) {
            case 'JsonWebTokenError': return next(createError.Unauthorized());
            case 'TokenExpiredError': return next(createError.Unauthorized(err.message));
            default:
                console.log(err);
                return next(createError.InternalServerError());
        }
    }
}

export async function verifyRefreshTokenMW(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();
        const payload = await verifyRefreshToken(refreshToken);
        const userId = payload.aud;
        let redisRefreshToken;
        try { redisRefreshToken = await client.GET(userId); }
        catch (err) {
            console.log(err.message);
            return next(createError.InternalServerError());
        }
        if(redisRefreshToken !== refreshToken) throw createError.Unauthorized();
        req.payload = payload;
        return next();
    }
    catch (err) {
        console.log(err.name);
        switch (err.name) {
            case 'JsonWebTokenError':
            case 'UnauthorizedError':
                return next(createError.Unauthorized());
            case 'TokenExpiredError': return next(createError.Unauthorized(err.message));
            default:
                console.log(err);
                return next(createError.InternalServerError());
        }
    }
}