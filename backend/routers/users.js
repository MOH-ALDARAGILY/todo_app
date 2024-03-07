import { Router } from 'express';
import { Types } from 'mongoose';

import User from '../models/user.js';
import upload from '../middlewares/file-upload.js';

import hashPassword from '../helpers/hash.js';
import { compare } from 'bcrypt';
import {
    checkBirthDate,
    checkEmail,
    checkId,
    checkName,
    checkPassword
} from '../middlewares/validations.js';
import registered from '../middlewares/registered.js';
import Todo from '../models/todo.js';

const users = Router();

//GET USER BY ID:
users.get('/:id', checkId, async (req, res, next) => {
    try {
        const { id } = req.params;
        const objectId = new Types.ObjectId(id);
        const user = await User.findById(objectId);
        if (!user) {
            res.status(404);
            return next(new Error('Bad Request: No User With Specified ID.'));
        }
        return res.status(200).json(user);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//PUT USER (EDIT USER):
users.put(
    '/:id',
    checkId,
    checkName,
    checkBirthDate,
    async (req, res, next) => {
        try {
            const { params, body } = req;
            const id = params.id;
            const objectId = new Types.ObjectId(id);
            let user = await User.findById(objectId);
            if (!user) {
                res.status(404);
                return next(new Error('Bad Request: No User With Specified ID.'));
            }
            user = await User.findByIdAndUpdate(objectId, {
                firstName: body.firstName,
                lastName: body.lastName,
                birthDate: body.birthDate,
            }, { new: true });
            return res.status(201).json(user);
        }
        catch (err) {
            res.status(500);
            return next(new Error(err));
        }
    });

//PATCH USER (CHANGE EMAIL):
users.patch(
    '/:id/email',
    checkId,
    checkEmail,
    checkPassword,
    registered,
    async (req, res, next) => {
        try {
            const { params, body } = req;
            const id = params.id;
            const objectId = new Types.ObjectId(id);
            let user = await User.findById(objectId);
            if (!user) {
                res.status(404);
                return next(new Error('Bad Request: No User With Specified ID.'));
            }
            const password = await hashPassword(body.password);
            const match = await compare(body.password, user.password);
            if (!match) {
                res.status(404);
                return next(new Error('Bad Request: Incorrect Password.'));
            }
            user = await User.findByIdAndUpdate(objectId, { $set: { email: body.email } }, { new: true });
            return res.status(200).json(user);
        }
        catch (err) {
            res.status(500);
            return next(new Error(err));
        }
    });

//PATCH USER (CHANGE PROFILE_PICTURE):
users.patch(
    '/:id/profile_picture',
    upload.single('profile_picture'),
    checkId,
    async (req, res, next) => {
        try {
            const { params, file } = req;
            const id = params.id;
            const objectId = new Types.ObjectId(id);
            const user = await User.findByIdAndUpdate(objectId, { $set: { image: file.filename } }, { new: true });
            if (!user) {
                res.status(404);
                return next(new Error('Bad Request: No User With Specified ID.'));
            }
            return res.status(200).json(user);
        }
        catch (err) {
            res.status(500);
            return next(new Error(err));
        }
    });

//PATCH USER (RESET PASSWORD)):
users.patch(
    '/:id/password',
    checkId,
    checkPassword,
    async (req, res, next) => {
        try {
            const { params, body } = req;
            const id = params.id;
            const objectId = new Types.ObjectId(id);
            let user = await User.findById(objectId);
            if (!user) {
                res.status(404);
                return next(new Error('Bad Request: No User With Specified ID.'));
            }
            const password = await hashPassword(body.password);
            const match = await compare(body.oldPassword, user.password);
            if (!match) {
                res.status(404);
                return next(new Error('Bad Request: Incorrect Old Password.'));
            }
            user = await User.findByIdAndUpdate(objectId, { $set: { password: password } }, { new: true });
            return res.status(200).json(user);
        }
        catch (err) {
            res.status(500);
            return next(new Error(err));
        }
    });

//DELETE USER:
users.delete('/:id', checkId, async (req, res, next) => {
    try {
        const { params } = req;
        const id = params.id;
        const objectId = new Types.ObjectId(id);
        const user = await User.findByIdAndDelete(objectId);
        if (!user) {
            res.status(404)
            return next(new Error('Bad Request: No User With Specified ID.'));
        }
        await Todo.deleteMany({ user: objectId });
        return res.status(200).json(user);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
})

//ERROR HANDLER:
users.use((err, req, res, next) => {
    return res.json({ error: err.message });
});

export default users;