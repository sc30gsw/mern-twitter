import express from "express";
import authRouter from "./auth";
import tweetRouter from "./tweet";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/tweet", tweetRouter);

module.exports = router;
