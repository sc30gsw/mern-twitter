import express from "express";
import {
	countRetweet,
	create,
	createRetweet,
	deleteRetweet,
	searchTweets,
	searchUserTweets,
} from "../services/tweetService";
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

// ユーザーツイート一覧取得APIの呼出
router.post(
	"/searchUserTweets",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		searchUserTweets(req, res);
	}
);

// リツイート作成APIの呼出
router.post(
	"/createRetweet",
	validContentLength,
	printErrors,
	verifyToken,
	(req: express.Request, res: express.Response) => {
		createRetweet(req, res);
	}
);

// リツイート削除APIの呼出
router.delete(
	"/deleteRetweet",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		deleteRetweet(req, res);
	}
);

// リツイート件数取得APIの呼出
router.post(
	"/countRetweet",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		countRetweet(req, res);
	}
);

export default router;
