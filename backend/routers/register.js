import { Router } from 'express';
import User from '../models/user.js';
import hashPassword from '../helpers/hash.js';
import upload from '../middlewares/file-upload.js';
import {
    checkBirthDate,
    checkEmail,
    checkImage,
    checkName,
    checkPassword
} from '../middlewares/validations.js';
import registered from '../middlewares/registered.js';

const regiser = Router();

//REGISTER (SIGN-UP):
regiser.post(
    '/',
    upload.single('profile_picture'),
    checkName,
    checkBirthDate,
    checkEmail,
    registered,
    checkPassword,
    checkImage,
    async (req, res, next) => {
        try {
            const { body, file } = req;
            const password = await hashPassword(body.password);
            const user = new User({
                firstName: body.firstName,
                lastName: body.lastName,
                birthDate: body.birthDate,
                email: body.email,
                password,
                image: `/assets/images/${file.filename}`
            });
            await user.save();
            return res.status(201).json(user);
        }
        catch (err) {
            res.status(500);
            next(new Error(err));
        }
    });

//ERROR HANDLER:
regiser.use((err, req, res, next) => {
    return res.json({ error: err.message });
});

export default regiser;