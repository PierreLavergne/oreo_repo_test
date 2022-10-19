import User from "../../models/authUser";
import Oauth2User from "../../models/oauth2User";
import pool from "../db";

const createOAuth2 = (client_id: string, service: string, access_token: string, refresh_token?: string, expiry_date?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        let params: string[] = [client_id, service, access_token];
        let queryInsert = "INSERT INTO oauth2 (client_id, service, access_token"
        let queryValues = " VALUES (UUID_TO_BIN(?), ?, ?";
        if (refresh_token !== undefined) {
            queryValues += ', ?';
            queryInsert += ', refresh_token';
            params.push(refresh_token);
        }
        if (expiry_date !== undefined) {
            queryValues += ', FROM_UNIXTIME(? * 0.001)';
            queryInsert += ', expiry_date';
            params.push(String(expiry_date));
        }
        queryInsert += ')';
        queryValues += ')';
        pool.execute(queryInsert + queryValues, params, (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result)));
        });
    });
};

const selectAccessTokenByClientId = (client_id: string): Promise<Oauth2User> => {
    return new Promise((resolve, reject) => {
        const query: string = "SELECT access_token FROM oauth2 WHERE client_id = UUID_TO_BIN(?)";
        pool.execute(query, [client_id], (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result))[0]);
        });
    });
};

export { createOAuth2, selectAccessTokenByClientId };