import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

router.get("/web", (req, res) => {
    res.redirect(String(process.env.FACEBOOK_REDIRECT_URI_WEB));
});

const getFacebookToken = async (code: string): Promise<any> => {
    const params: URLSearchParams = new URLSearchParams([
        ['client_id', String(process.env.FACEBOOK_APP_ID)],
        ['redirect_uri', 'https://127.0.0.1:5000/auth/facebook/callback/web'],
        ['client_secret', String(process.env.FACEBOOK_APP_SECRET)],
        ['code', code]
    ]);

    const response = await axios.get(String(process.env.FACEBOOK_VERIFY_CODE_URI), {
        params
    });
    return response.data.access_token;
};

const getFacebookUserInfos =async (token: string): Promise<any> => {
    const params: URLSearchParams = new URLSearchParams([
        ['input_token', token],
        ['access_token', token]
    ]);

    const response = await axios.get(String(process.env.FACEBOOK_DEBUG_TOKEN_URI), {
        params
    });

    return response.data;
};

router.get("/callback/web", async (req, res) => {
    let token;
    let response;

    try {
        token = await getFacebookToken(String(req.query.code));
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }
    try {
        response = await getFacebookUserInfos(String(token));
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }

    console.log(token);
    console.log(response);
    res.redirect(String(process.env.WEB_APP_HOME));
});

export default router;