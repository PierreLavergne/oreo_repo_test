import express from "express";
import register from "./simple/register"
import login from "./simple/login"
import googleAuth from "./oauth2/google";
import githubAuth from "./oauth2/github";
import facebookAuth from "./oauth2/facebook";
import discordAuth from "./oauth2/discord";
import spotifyAuth from "./oauth2/spotify";
import tiktokAuth from "./oauth2/tiktok";

const router = express.Router();

router.use("/login", login);

router.use("/register", register);

router.use("/google", googleAuth);

router.use("/github", githubAuth);

router.use("/facebook", facebookAuth);

router.use("/discord", discordAuth);

router.use("/spotify", spotifyAuth);

router.use("/tiktok", tiktokAuth);

export default router;