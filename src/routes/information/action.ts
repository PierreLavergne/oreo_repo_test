import { selectActionsByService } from "../../db/queries/action";
import Action from "../../models/action";
import Logger from "../../utils/logger";
import express from "express";

const router = express.Router();

router.get("/:service_id", async (req, res) => {
    let actions: Action[];
    const service_id: string = req.params.service_id;

    try {
        actions = await selectActionsByService(service_id);
    } catch (err: any) {
        Logger.mysqlError(err);
        return res.status(400).send("Bad request");
    }
    res.status(200).send(actions);
});

export default router;