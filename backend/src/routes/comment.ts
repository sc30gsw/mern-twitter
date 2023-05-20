import express from "express";
import { validContentLength } from "../services/validation/tweetValid";
import { printErrors } from "../services/validation/validation";
import verifyToken from "../middleware/tokenHandler";
import upload from "../middleware/multerHandler";
import { create, getComments } from "../services/commentService";

const router = express.Router();

// コメント新規登録APIの呼出
router.post(
	"/create",
	validContentLength,
	printErrors,
	verifyToken,
	upload.array("commentImage", 4),
	(req: express.Request, res: express.Response) => {
		create(req, res);
	}
);

// コメント一覧取得APIの呼出
router.post(
	"/getComments",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		getComments(req, res);
	}
);

export default router;
