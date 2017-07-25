import { pool } from 'pg';

const pool = new pool({
    host: 'localhost',
    user: 'boomtowndemo',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

export default pool;
