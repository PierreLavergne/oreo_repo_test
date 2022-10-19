import Action from "../../models/action";
import pool from "../db";

const selectActionsByService = (service_id: string): Promise<Action[]> => {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, action_name FROM actions WHERE service_id = UUID_TO_BIN(?)";
        pool.execute(query, [service_id], (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result)));
        });
    });
};

const selectActionByActionId = (action_id: string): Promise<Action> => {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, action_name FROM actions WHERE id = ?";
        pool.execute(query, [action_id], (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result))[0]);
        });
    });
};

export { selectActionsByService, selectActionByActionId };