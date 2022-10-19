import { createOAuth2 } from "../../../db/queries/oauth2";
import { createUser } from "../../../db/queries/user";
import jsonwebtoken from "jsonwebtoken";
import User from "../../../models/user";
import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect(String(process.env.GITHUB_REDIRECT_URI));
});

const getGithubToken = async (code: string): Promise<any> => {
    const params: URLSearchParams = new URLSearchParams([
        ['client_id', String(process.env.GITHUB_CLIENT_ID)],
        ['client_secret', String(process.env.GITHUB_CLIENT_SECRET)],
        ['code', code]
    ]);

    const response = await axios.post(String(process.env.GITHUB_GET_TOKEN_URI), params, {
        headers: {
            "Accept": "application/json"
        }
    });
    return response.data;
};

router.get("/callback", async (req, res) => {
    let response;
    let jwt;

    try {
        response = await getGithubToken(String(req.query.code));
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }
    if (!response.access_token) {
        return res.status(400).send("Bad request");
    }
    try {
        const user: User = await createUser();
        console.log(user.id);
        await createOAuth2(user.id, 'github', String(response.access_token));
        jwt = jsonwebtoken.sign({id: user.id}, String(process.env.SECRET_KEY))
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }

    const params: URLSearchParams = new URLSearchParams([
        ['token', jwt]
    ]);
    return res.redirect(String(process.env.WEB_APP_HOME) + params);
});
    

export default router;