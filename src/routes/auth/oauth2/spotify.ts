import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect(String(process.env.SPOTIFY_REDIRECT_URI));
});

const getSpotifyToken =async (code: string): Promise<any> => {
    const authorization: string = Buffer.from(String(process.env.SPOTIFY_CLIENT_ID) + ':' + String(process.env.SPOTIFY_CLIENT_SECRET)).toString('base64');
    const params: URLSearchParams = new URLSearchParams([
        ['grant_type', 'authorization_code'],
        ['code', code],
        ['redirect_uri', 'https://127.0.0.1:5000/auth/spotify/callback']
    ]);

    const response = await axios.post(String(process.env.SPOTIFY_GET_TOKEN_URI),
        params, {
        headers: {
            "Authorization": "Basic " + authorization,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    return response.data.access_token;
};

const getSpotifyUserInfos =async (token: string): Promise<any> => {
    const response = await axios.get(String(process.env.SPOTIFY_GET_USER_INFOS), {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    return response.data;
};

router.get("/callback",async (req, res) => {
    let token;
    let response;

    try {
        token = await getSpotifyToken(String(req.query.code));
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }

    try {
        response = await getSpotifyUserInfos(String(token));
    } catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }
    console.log(response);
    return res.redirect(String(process.env.WEB_APP_HOME));
});

export default router;