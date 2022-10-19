import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect(String(process.env.TIKTOK_REDIRECT_URI));
});

const getTiktokToken = async (code: string): Promise<any> => {
    const params: URLSearchParams = new URLSearchParams([
        ['client_key', String(process.env.TIKTOK_CLIENT_ID)],
        ['client_secret', String(process.env.TIKTOK_CLIENT_SECRET)],
        ['code', code],
        ['grant_type', 'authorization_code']
    ]);

    const response = await axios.post(String(process.env.TIKTOK_GET_TOKEN_URI), {
        params
    });
    return response.data.access_token;
};

router.get("/callback",async (req, res) => {
    let token;
    let response;

    try {
        token = await getTiktokToken(String(req.query.code));
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }
    // try {
    //     response = await getFacebookUserInfos(String(token));
    // } catch (err) {
    //     console.log(err);
    // }

    console.log(token);
    res.redirect(String(process.env.WEB_APP_HOME));
});

export default router;