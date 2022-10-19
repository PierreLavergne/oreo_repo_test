import AuthUser from "../../models/authUser";
import pool from "../db";

const createAuthUser = (client_id: string, email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO auth(client_id, email, password) VALUES((SELECT id FROM users WHERE id = UUID_TO_BIN(?)), ?, ?)";
        pool.execute(query, [client_id, email, password], (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result)));
        });
    });
};

const selectAuthUserByEmail = (email: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
        const query = "SELECT BIN_TO_UUID(client_id) client_id, email, password FROM auth WHERE email = ?";
        pool.execute(query, [email], (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result))[0]);
        });
    });
};

export { createAuthUser, selectAuthUserByEmail };