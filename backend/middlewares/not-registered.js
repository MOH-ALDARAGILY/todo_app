import User from "../models/user.js";
import createError from 'http-errors';

export default async function notRegistered(req, res, next) {
    try {
        const { email } = req.body;
        const regesteredUser = await User.findOne({ email });
        if (!regesteredUser) return next(createError.Unauthorized(`${email} is not registered.`));
        return next();
    }
    catch (err) {
        console.log(err);
        return next(createError.InternalServerError());
    }
}