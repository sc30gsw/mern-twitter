import express from "express";
import {
	forgotPassword,
	login,
	register,
	resetPassword,
	updateUser,
} from "../services/userService";
import {
	validConfirmPasswordLength,
	validEmailExist,
	validEmailFormat,
	validPasswordLength,
	validPasswordMatches,
	validProfileNameLength,
	validUsernameExist,
	validUsernameFormat,
	validUsernameLength,
	validUsernameOrEmail,
} from "../services/validation/userValid";
import verifyToken from "../middleware/tokenHandler";
import upload from "../middleware/multerHandler";
import { printErrors } from "../services/validation/validation";

const router = express.Router();

// メールアドレスバリデーションAPIを呼出
// フロントエンドの仕様でAPIによりエラーチェックをする
router.post(
	"/authUser",
	validEmailFormat,
	printErrors,
	(req: express.Request, res: express.Response) => {
		validEmailExist(req, res);
	}
);

// ユーザー新規登録APIを呼出
router.post(
	"/register",
	validUsernameLength,
	validUsernameFormat,
	validProfileNameLength,
	validEmailFormat,
	validPasswordLength,
	validConfirmPasswordLength,
	validUsernameExist,
	validPasswordMatches,
	printErrors,
	(req: express.Request, res: express.Response) => {
		register(req, res);
	}
);

// ユーザーログインAPI呼出
router.post(
	"/login",
	validUsernameOrEmail,
	validPasswordLength,
	printErrors,
	(req: express.Request, res: express.Response) => {
		login(req, res);
	}
);

// トークン検証APIの呼出
router.post(
	"/verify-token",
	verifyToken,
	(req: express.Request, res: express.Response) => {
		return res.status(200).json({ user: req.user });
	}
);

// パスワードリセット通知APIの呼出
router.post(
	"/forgotPassword",
	validUsernameOrEmail,
	printErrors,
	(req: express.Request, res: express.Response) => {
		forgotPassword(req, res);
	}
);

// パスワードリセットAPIの呼出
router.post(
	"/resetPassword",
	validPasswordLength,
	validConfirmPasswordLength,
	validPasswordMatches,
	printErrors,
	(req: express.Request, res: express.Response) => {
		resetPassword(req, res);
	}
);

// ユーザー更新APIの呼出
router.patch(
	"/update/:userId",
	verifyToken,
	upload.fields([{ name: "profileImg" }, { name: "icon" }]),
	(req: express.Request, res: express.Response) => {
		updateUser(req, res);
	}
);

export default router;
