import { hash } from 'bcrypt';

const saltRounds = parseInt(process.env.SALTROUNDS) || 10;
export default function hashPassword(password) {
    return hash(password, saltRounds);
};