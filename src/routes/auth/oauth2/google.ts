import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import { createOAuth2 } from "../../../db/queries/oauth2";
import { createUser } from "../../../db/queries/user";
import jsonwebtoken from "jsonwebtoken";
import User from "../../../models/user";
import { google } from 'googleapis';
import express from "express";

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email'
];

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
});

router.get("/", (req, res) => {
    res.redirect(authorizationUrl);
});

router.get("/callback", async (req, res) => {
    let response: GetTokenResponse;
    let jwt: string;
    
    try {
        response = await oauth2Client.getToken(String(req.query.code));
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }
    oauth2Client.setCredentials(response.tokens);

    if(!response.tokens.access_token) {
        res.status(400).send("Bad request");
    }

    try {
        const user: User = await createUser();
        await createOAuth2(user.id, 'google', String(response.tokens.access_token), String(response.tokens.refresh_token), Number(response.tokens.expiry_date));
        jwt = jsonwebtoken.sign({id: user.id}, String(process.env.SECRET_KEY));
    } catch (err: any) {
        console.log(err);
        return res.status(400).send("Bad request");
    }

    const params: URLSearchParams = new URLSearchParams([
        ['token', jwt]
    ]);
    res.redirect(String(process.env.WEB_APP_HOME) + params);
});

export default router;