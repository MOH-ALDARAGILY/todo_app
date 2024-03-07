import { randomBytes } from 'crypto'; 

const accessTokenSecret = randomBytes(32).toString('hex');
const refreshTokenSecret = randomBytes(32).toString('hex');

console.table({ accessTokenSecret, refreshTokenSecret });