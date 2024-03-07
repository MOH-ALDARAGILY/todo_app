import Joi from 'joi';

const patterns = {
    name: /^[A-Z][a-z]{2,29}$/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

let maxDate = new Date(Date.now());
const years = maxDate.getFullYear();
maxDate.setFullYear(years - 6);

export const userSchema = Joi.object({
    firstName: Joi
        .string()
        .min(3)
        .max(30)
        .pattern(patterns.name)
        .required(),
    lastName: Joi
        .string()
        .min(3)
        .max(30)
        .pattern(patterns.name)
        .required(),
    birthDate: Joi
        .date()
        .less(maxDate)
        .required(),
    email: Joi
        .string()
        .email()
        .lowercase()
        .pattern(patterns.email)
        .required(),
    password: Joi
        .string()
        .min(8)
        .pattern(patterns.password)
        .required()
});

export const loginSchema = Joi.object({
    email: Joi
        .string()
        .email()
        .lowercase()
        .pattern(patterns.email)
        .required(),
    password: Joi
        .string()
        .min(8)
        .pattern(patterns.password)
        .required()
});