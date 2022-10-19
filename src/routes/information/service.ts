import express from "express";
import { selectServices } from "../../db/queries/service";
import Service from "../../models/service";
import Logger from "../../utils/logger";

const router = express.Router();

router.get("/", async (req, res) => {
    let services: Service;

    try {
        services = await selectServices();
    } catch (err: any) {
        Logger.mysqlError(err);
        return res.status(400).send("Bad request");
    }
    res.status(200).send(services);
});

export default router;