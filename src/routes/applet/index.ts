import express from "express";
import applet from './applet'

const router = express.Router();

router.use("/create", applet);

export default router;