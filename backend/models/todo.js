import { model, Schema } from 'mongoose';
import confirmdeadlineValidator from '../helpers/deadline-validator.js';

const TodoSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        uinique: true
    },
    description: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        validate: confirmdeadlineValidator
    },
    status: {
        type: String,
        enum: [ 'Pending', 'In-Progress', 'Done' ],
        default: 'Pending'
    },
},
{ timestamps: true });

const Todo = model('todo', TodoSchema);

export default Todo;