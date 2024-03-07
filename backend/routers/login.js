import { Router } from 'express';
import User from '../models/user.js';


import { compare } from 'bcrypt';
import { signAccessToken } from '../helpers/token.js';
import { checkEmail } from '../middlewares/validations.js';
import notRegistered from '../middlewares/not-registered.js';

const login = Router();

//LOGIN (SIGN-IN):
login.post(
    '/',
    checkEmail,
    notRegistered,
    async (req, res, next) => {
    try {
        const { body } = req;
        const user = await User.findOne({ email: body.email });
        const match = await compare(body.password, user.password);
        if (!match) {
            res.status(404);
            return next(new Error('Bad Request: Incorrect Password.'));
        }
        const token = await signAccessToken(user._id);
        return res.status(200).json({ token });
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//ERROR HANDLER:
login.use((err, req, res, next) => {
    return res.json({ error: err.message });
});

export default login;