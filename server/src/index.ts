import http from 'http';

import app from './app';
import env from '@config/env'
import db from '@config/db';

db;

const server = http.createServer(app);
server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err);
});

process.on('uncaughtException', (err) => {
    console.log(err);
});