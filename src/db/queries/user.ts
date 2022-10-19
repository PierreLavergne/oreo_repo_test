import User from "../../models/user";
import pool from "../db";

const createUser = (): Promise<User> => {
    return new Promise((resolve, reject) => {
        const query = "SET @uuid=UUID_TO_BIN(UUID());INSERT INTO users (id) VALUES (@uuid);SELECT BIN_TO_UUID(@uuid) id";
        pool.query(query, (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result))[2][0]);
        });
    });
};

export { createUser };