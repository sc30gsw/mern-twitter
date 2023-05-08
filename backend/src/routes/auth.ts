import express from "express";
import {
	forgotPassword,
	login,
	register,
	resetPassword,
	updateUser,
} from "../services/userService";
import {
	printErrors,
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
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// ファイルの保存先とファイル名を指定
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// 画像がuploadされるパス
		const uploadPath = path.resolve(
			__dirname,
			"../../../frontend/twitter-clone/public"
		);

		// uploadPathにディレクトリが存在するかどうかを確認
		if (!fs.existsSync(uploadPath)) {
			// uploadPathにディレクトリが存在しない場合、ディレクトリを作成
			fs.mkdirSync(uploadPath, { recursive: true });
		}

		cb(null, uploadPath);
	},
	// アップロードされるファイル名を作成
	filename: (req, file, cb) => {
		const uniqueSuffix = Math.random().toString(26).substring(4, 10);
		cb(null, `${Date.now()}-${uniqueSuffix}-${file.originalname}`);
	},
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		console.log(file.mimetype);
		// ファイルのMIMEタイプが以下のいずれかの場合のみファイルアップロードを許可
		if (
			["video/mp4", "image/png", "image/jpeg", "audio/mpeg"].includes(
				file.mimetype
			)
		) {
			cb(null, true);
			return;
		}
		cb(new TypeError("Invalid File Type"));
	},
});

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
	validEmailExist,
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

// パスワード忘れリクエストAPIの呼出
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
	"/update",
	upload.fields([{ name: "profileImg" }, { name: "icon" }]),
	(req: express.Request, res: express.Response) => {
		updateUser(req, res);
	}
);

export default router;
