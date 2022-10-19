import { createOAuth2 } from "../../../db/queries/oauth2";
import { createUser } from "../../../db/queries/user";
import jsonwebtoken from "jsonwebtoken";
import User from "../../../models/user";
import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

router.get("/web", (req, res) => {
    res.redirect(String(process.env.DISCORD_AUTH_URL_WEB));
});

router.get("/mobile", (req, res) => {
    res.redirect(String(process.env.DISCORD_AUTH_URL_MOBILE));
});

const getDiscordUserInfos = async (code: string, redirect_uri: string): Promise<any> => {
    const params = new URLSearchParams([
        ['client_id', String(process.env.DISCORD_CLIENT_ID)],
        ['client_secret', String(process.env.DISCORD_CLIENT_SECRET)],
        ['grant_type', 'authorization_code'],
        ['code', String(code)],
        ['redirect_uri', redirect_uri],
        ['scope', 'identify']
    ]);

    const response = await axios.post(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`, params, {
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
    });

    return response.data;
};

router.get("/callback/web", async (req, res) => {
    const response = await getDiscordUserInfos(String(req.query.code), String(process.env.DISCORD_REDIRECT_URI_WEB));
    let jwt;

    if (!response.access_token) {
        return res.status(400).send("Bad request");
    }
    try {
        const user: User = await createUser();
        await createOAuth2(user.id, 'discord', String(response.access_token), String(response.refresh_token), Number(response.expires_in));
        jwt = jsonwebtoken.sign({id: user.id}, String(process.env.SECRET_KEY))
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }

    const params: URLSearchParams = new URLSearchParams([
        ['token', jwt]
    ]);
    res.redirect(String(process.env.WEB_APP_HOME) + params);
});

router.get("/callback/mobile", async (req, res) => {
    const response = await getDiscordUserInfos(String(req.query.code), String(process.env.DISCORD_REDIRECT_URI_MOBILE));

    console.log(response);

    res.redirect(String(process.env.MOBILE_APP_HOME));
});

export default router;