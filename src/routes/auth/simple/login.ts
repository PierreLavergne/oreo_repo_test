import express from "express";
import bcrypt from "bcrypt";
import Logger from "../../../utils/logger";
import jsonwebtoken from "jsonwebtoken";
import AuthUser from "../../../models/authUser";
import { selectAuthUserByEmail } from "../../../db/queries/auth";

const router = express.Router();

router.post("/", async (req, res) => {
    let user: AuthUser;
    const loginUser: AuthUser = req.body;

    if (typeof loginUser.email !== "string" ||
        typeof loginUser.password !== "string") {   
        return res.status(400).send("Bad request");     
    }
    const regexpEmail: RegExp = new RegExp("[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+");

    if (regexpEmail.test(loginUser.email) === false) {
        return res.status(400).send("Bad request");
    }
    try {
        user = await selectAuthUserByEmail(loginUser.email);
    } catch (err: any) {
        Logger.mysqlError(err);
        return res.status(400).send("Bad request");
    }
    if (user === null) {
        return res.status(400).send("Bad request");
    }
    if (!bcrypt.compareSync(loginUser.password, user.password)) {
        return res.status(403).send("Bad request");
    }
    return res.status(200).send(jsonwebtoken.sign({id: user.client_id}, String(process.env.SECRET_KEY)));
});

export default router;