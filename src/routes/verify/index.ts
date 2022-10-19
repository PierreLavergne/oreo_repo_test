import express from "express";
import tokenVerify from "./token";

const router = express.Router();

router.use("/token", tokenVerify);

export default router;