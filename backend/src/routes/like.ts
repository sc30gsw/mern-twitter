import express from "express";
import verifyToken from "../middleware/tokenHandler";
import {
	create,
	deleteLike,
	getUserLike,
	getLikes,
} from "../services/likeService";

const router = express.Router();

// いいね登録APIの呼出
router.post(
	"/create",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		create(req, res);
	}
);

// いいね取得APIの呼出
router.post(
	"/getUserLike",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		getUserLike(req, res);
	}
);

// いいね一覧取得APIの呼出
router.post(
	"/getLikes",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		getLikes(req, res);
	}
);

// いいね削除APIの呼出
router.delete(
	"/delete",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		deleteLike(req, res);
	}
);

export default router;
