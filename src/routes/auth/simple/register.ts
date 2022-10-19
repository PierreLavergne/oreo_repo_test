import express from "express";
import RegisterUser from "../../../models/registerUser";
import { createUser } from "../../../db/queries/user";
import jsonwebtoken from "jsonwebtoken";
import Logger from "../../../utils/logger";
import bcrypt from "bcrypt";
import User from "../../../models/user";
import { createAuthUser } from "../../../db/queries/auth";

const router = express.Router();

router.post("/", async (req, res) => {
    const registerUser: RegisterUser = req.body;

    if (typeof registerUser.email !== "string" ||
        typeof registerUser.password !== "string" ||
        typeof registerUser.confirmPassword !== "string") {
        return res.status(400).send("Bad request");
    }

    const regexpEmail: RegExp = new RegExp("[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+");

    if (regexpEmail.test(registerUser.email) === false) {
        return res.status(400).send("Bad request");
    }
    if (registerUser.password !== registerUser.confirmPassword) {
        return res.status(400).send("Bad request");
    }

    try {
        registerUser.password = await bcrypt.hash(registerUser.password, 8);
        const user: User = await createUser();
        await createAuthUser(user.id, registerUser.email, registerUser.password);
        return res.status(200).send(jsonwebtoken.sign({id: user.id}, String(process.env.SECRET_KEY)));
    } catch (err: any) {
        Logger.mysqlError(err);
        return res.status(400).send("Bad request");
    }
});

export default router;