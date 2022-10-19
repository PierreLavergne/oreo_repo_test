import Reaction from "../../models/reaction";
import pool from "../db";

const selectReactionsByService = (service_id: string): Promise<Reaction[]> => {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, reaction_name FROM reactions WHERE service_id = UUID_TO_BIN(?)";
        pool.execute(query, [service_id], (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result)));
        });
    });
};

const selectReactionByReactionId = (reaction_id: string): Promise<Reaction> => {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, reaction_name FROM reactions WHERE id = ?";
        pool.execute(query, [reaction_id], (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result))[0]);
        });
    });
};

export { selectReactionsByService, selectReactionByReactionId };