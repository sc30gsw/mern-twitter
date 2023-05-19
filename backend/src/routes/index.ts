import express from "express";
import authRouter from "./auth";
import tweetRouter from "./tweet";
import commentRouter from "./comment";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/tweet", tweetRouter);
router.use("/comment", commentRouter);

module.exports = router;
