import User from "../models/user.js";
import { compare } from 'bcrypt';

export default async function comparePasswords(req, res, next) {
    try {
        const { body } = req;
        const user = await User.findOne({ email: body.email });
        const match = await compare(body.password, user.password);
        if (!match) {
            res.status(404);
            return next(new Error('Bad Request: Incorrect Password.'));
        }
        return next();
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
}