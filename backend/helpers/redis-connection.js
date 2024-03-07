import { createClient } from 'redis';

export const client = await createClient({
    socket: {
        host: 'localhost',
        port: 6379,
        connectTimeout: 5000,
        reconnectStrategy: retries => Math.min(retries * 50, 500)
    }
})
    .on('connect', () => console.log('Redis connected.'))
    .on('ready', () => console.log('Redis ready.'))
    .on('error', err => console.log(err.message))
    .on('end', () => console.log('Redis disconnected.'))
    .connect();

process.on('SIGINT', async () => {
    await client.quit();
    process.exit(0);
});