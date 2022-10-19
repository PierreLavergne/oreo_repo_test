import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/:token", (req, res) => {
    jwt.verify(req.params.token, String(process.env.SECRET_KEY), (err, result) => {
        if (err) {
            return res.status(400).send("Bad token");
        }
        res.send("ok");
    });
});

export default router;