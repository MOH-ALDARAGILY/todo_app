import express, { json, urlencoded } from 'express';
import createError from 'http-errors';
import morgan from 'morgan';
import cors from 'cors';

import auth from './routers/auth.js';
import './helpers/db-connection.js';
import './helpers/redis-connection.js';
import users from './routers/users.js';
import { verifyAccessTokenMW } from './middlewares/verify-token.js';
import todos from './routers/todos.js';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/auth', auth);
app.use('/api/users', verifyAccessTokenMW, users);
// app.use('/api/todos', verifyUser, todos);

app.use(async(req, res, next) => {
    return next(createError.NotFound());
});

app.use(async(err, req, res, next) => {
    if(err.isJoi) {
        const errDetails = err.details[0];
        if(errDetails.type === 'any.required') {
            err.status = 400;
            err.message = 'missing '
        }
        else {
            err.status = 422;
            err.message = 'invalid ';
        }
        err.message += errDetails.context.key;
    }
    res.status(err.status || 500);
    return res.send({
        error: {
            status: err.status || 500,
            message: err.message || 'server error'
        }
    });
});

app.listen(PORT, () => {
    console.log(`app listents at http://localhost:${PORT}`);
});

