import { Router } from 'express';
import { Types } from 'mongoose';
import Todo from '../models/todo.js';
import { checkId } from '../middlewares/validations.js';

const todos = Router();

// //GET ALL TODOS FOR SPECIFIC USER:
// todos.get('/', async (req, res, next) => {
//     try {
//         const { body } = req;
//         const id = body.user;
//         if (!id) {
//             res.status(404);
//             return next(new Error('Bad Request: No ID Provided.'));
//         }
//         const todos = await Todo.find({ user: body.user });
//         return res.status(200).json(todos);
//     }
//     catch (err) {
//         res.status(500);
//         return next(new Error(err));
//     }
// });

//GET TODOS BY TITLE AND STATUS FOR SPECIFIC USER:
todos.get('/', async (req, res, next) => {
    try {
        const { body, query } = req;
        const id = body.user;
        if (!id) {
            res.status(404);
            return next(new Error('Bad Request: No ID Provided.'));
        }
        debugger;
        const title = query.title;
        const titleReg = new RegExp(`^${title}`, 'i');
        const status = query.status;
        let todos;
        if(!title && !status)
            todos = await Todo.find({ user: body.user });
        if(!title && status)
            todos = await Todo.find({ $and:[ { user: body.user }, { status } ] });
        if(title && !status)
            todos = await Todo.find({ $and:[ { user: body.user }, { title: { $regex: titleReg } } ] });
        if(title && status)
            todos = await Todo.find({ $and:[ { user: body.user }, { title: { $regex: titleReg } }, { status } ] });
        return res.status(200).json(todos);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//POST TODO FOR SPECIFIC USER:
todos.post('/', async (req, res, next) => {
    try {
        const { body } = req;
        console.log(body);
        const id = body.user;
        if (!id) {
            res.status(404);
            return next(new Error('Bad Request: No ID Provided.'));
        }
        const todo = new Todo({
            user: id,
            title: body.title,
            description: body.description,
            deadline: body.deadline,
            status: body.status
        });
        await todo.save();
        return res.status(200).json(todo);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//PUT TODO (EDIT TODO):
todos.put('/:id', checkId, async (req, res, next) => {
    try {
        const { params, body } = req;
        const id = params.id;
        const objectId = new Types.ObjectId(id);
        const todo = await Todo.findByIdAndUpdate(objectId, {
            title: body.title,
            description: body.description,
            deadline: body.deadline,
            status: body.status
        }, { new: true });
        if(!todo) {
            res.status(404);
            return next(new Error('Bad Request: No Todo With Specified ID.'));
        }
        return res.status(201).json(todo);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//PATCH TODO (CHANGE DESCRIPTION):
todos.patch('/:id/description', checkId, async (req, res, next) => {
    try {
        const { params, body } = req;
        const id = params.id;
        const objectId = new Types.ObjectId(id);
        const todo = await Todo.findByIdAndUpdate(objectId, { $set: { description: body.description } }, { new: true });
        if(!todo) {
            res.status(404);
            return next(new Error('Bad Request: No Todo With Specified ID.'));
        }
        return res.status(201).json(todo);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//PATCH TODO (CHANGE STATUS):
todos.patch('/:id/status', checkId, async (req, res, next) => {
    try {
        const { params, body } = req;
        const id = params.id;
        const objectId = new Types.ObjectId(id);
        const todo = await Todo.findByIdAndUpdate(objectId, { $set: { status: body.status } }, { new: true });
        if(!todo) {
            res.status(404);
            return next(new Error('Bad Request: No Todo With Specified ID.'));
        }
        return res.status(201).json(todo);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//DELETE TODO:
todos.delete('/:id', checkId, async (req, res, next) => {
    try {
        const { params } = req;
        const id = params.id;
        const objectId = new Types.ObjectId(id);
        const todo = await Todo.findByIdAndDelete(objectId);
        if(!todo) {
            res.status(404);
            return next(new Error('Bad Request: No Todo With Specified ID.'));
        }
        return res.status(200).json(todo);
    }
    catch (err) {
        res.status(500);
        return next(new Error(err));
    }
});

//ERROR HANDLER:
todos.use((err, req, res, next) => {
    return res.json({ error: err.message });
});

export default todos;