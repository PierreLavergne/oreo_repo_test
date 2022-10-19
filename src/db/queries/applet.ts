import Applet from "../../models/applet";
import pool from "../db";

const createApplet = (applet: Applet): Promise<void> => {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO applets (id, client_id, action_id, reaction_id) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?)";
        pool.execute(query, [applet.client_id, applet.action_id, applet.reaction_id],(err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result)));
        });
    });
};

export { createApplet };