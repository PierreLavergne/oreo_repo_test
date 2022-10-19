import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool: mysql.Pool = mysql.createPool({
    connectionLimit: 151,
    password: process.env.MYSQL_PASSWORD,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    multipleStatements: true
});

const initPool = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        const query = "SELECT 1";
        pool.execute(query, (err, result) => {
            if (err)
                return reject(err);
            return resolve(result);
        });
    })
}

export { initPool };

export default pool;