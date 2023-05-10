import express from "express";
import { create, searchTweets } from "../services/tweetService";
import verifyToken from "../middleware/tokenHandler";
import { validContentLength } from "../services/validation/tweetValid";
import { printErrors } from "../services/validation/validation";
import upload from "../middleware/multerHandler";

const router = express.Router();

// ツイート新規登録APIの呼出
router.post(
	"/create",
	validContentLength,
	printErrors,
	upload.array("tweetImage", 4),
	verifyToken,
	(req: express.Request, res: express.Response) => {
		create(req, res);
	}
);

// ツイート一覧検索APIの呼出
router.post("/search", (req: express.Request, res: express.Response) => {
	searchTweets(req, res);
});

export default router;
