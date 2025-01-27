
import { createPool } from 'mysql2';

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: 3306,
    database: 'pruebadb'
});
