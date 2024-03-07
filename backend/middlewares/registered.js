import User from "../models/user.js";

import createError from 'http-errors';

export default async function registered(req, res, next) {
    try {
        const { email } = req.body;
        const regesteredUser = await User.findOne({ email });
        if (regesteredUser) throw createError.Conflict(`${email} has bean already registered.`);
        return next();
    }
    catch (err) {
        return next(err);
    }
}