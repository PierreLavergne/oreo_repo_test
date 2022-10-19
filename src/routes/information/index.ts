import express from "express";
import service from "./service";
import action from "./action";
import reaction from "./reaction";

const router = express.Router();

router.use("/services", service);

router.use("/action", action);

router.use("/reaction", reaction);

export default router;