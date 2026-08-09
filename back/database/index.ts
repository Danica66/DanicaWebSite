import mysql from 'mysql2';
import { Cdatabase } from '../config/index'

const db = mysql.createPool({
    host: Cdatabase.host,
    port: Cdatabase.port,
    user: Cdatabase.username,
    password: Cdatabase.password,
    database: Cdatabase.database,
    connectionLimit: Cdatabase.pool.max,
    waitForConnections: true,
    queueLimit: 0,
});

export default db;
