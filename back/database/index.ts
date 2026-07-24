import mysql from 'mysql2';
import { Cdatabase } from '../config/index'

const db = mysql.createPool({
    host: Cdatabase.host,
    port: Cdatabase.port,
    user: Cdatabase.username,
    password: Cdatabase.password,
    database: Cdatabase.database,
});

export default db;