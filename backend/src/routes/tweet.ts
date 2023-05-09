import express from "express";
import { create } from "../services/tweetService";
import verifyToken from "../middleware/tokenHandler";
import { validContentLength } from "../services/validation/tweetValid";
import { printErrors } from "../services/validation/validation";
import upload from "../middleware/multerHandler";

const router = express.Router();

// ツイート新規登録APIの呼び出し
router.post(
	"/create",
	validContentLength,
	printErrors,
	verifyToken,
	upload.fields([{ name: "profileImg" }, { name: "icon" }]),
	(req: express.Request, res: express.Response) => {
		create(req, res);
	}
);

export default router;
