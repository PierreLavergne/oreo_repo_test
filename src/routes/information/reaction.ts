import { selectReactionsByService } from "../../db/queries/reaction";
import Reaction from "../../models/reaction";
import Logger from "../../utils/logger";
import express from "express";

const router = express.Router();

router.get("/:service_id", async (req, res) => {
    let reactions: Reaction[];

    try {   
        reactions = await selectReactionsByService(req.params.service_id);
    } catch (err: any) {
        Logger.mysqlError(err);
        return res.status(400).send("Bad request");
    }
    res.status(200).send(reactions);
});

export default router;