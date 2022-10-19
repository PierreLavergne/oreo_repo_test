import { selectReactionByReactionId } from '../../db/queries/reaction';
import { selectActionByActionId } from '../../db/queries/action';
import { createApplet } from "../../db/queries/applet";
import Reaction from '../../models/reaction';
import type Action from '../../models/action';
import Logger from "../../utils/logger";
import express from "express";
import type Applet from '../../models/applet';
import { actionMap } from '../../services/index'

const router = express.Router();

router.post("/", async (req, res) => {
    let action: Action;
    let reaction: Reaction;

    try {
        action = await selectActionByActionId(req.body.action_id);
        reaction = await selectReactionByReactionId(req.body.reaction_id);
    } catch (err: any) {
        Logger.mysqlError(err);
        return res.status(400).send('Bad request');
    }

    const applet: Applet = {
        id: "",
        client_id: res.locals.user.id,
        action_id: action.id,
        reaction_id: reaction.id
    };
    try {
        await createApplet(applet);
    } catch (err: any) {
        Logger.mysqlError(err);
        return res.status(400).send('Bad request');
    }
    const func: Function | undefined = actionMap.get(applet.action_id);
    if (func === undefined)
        return res.status(400).send('Bad request');
    func(applet.client_id, 'oreo_repo_test');
    return res.status(200).send("OK");
});

export default router;