import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
.then(() => console.log('MongoDB ready.'))
.catch(err => console.log(err.message));

mongoose.connection.on('connected', () => console.log('MongoDB connected.'));
mongoose.connection.on('error', err => console.log(err.message));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected.'));

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});