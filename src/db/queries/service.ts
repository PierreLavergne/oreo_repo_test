import Service from "../../models/service";
import pool from "../db";

const selectServices = (): Promise<Service> => {
    return new Promise((resolve, reject) => {
        const query = "SELECT BIN_TO_UUID(id) id, service, color FROM services";
        pool.execute(query, (err, result) => {
            if (err)
                return reject(err);
            return resolve(JSON.parse(JSON.stringify(result)));
        });
    });
};

export { selectServices };

