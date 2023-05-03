import express from "express";
import { login, register, resetPasswordRequest } from "../services/userService";
import {
	printErrors,
	validConfirmPasswordLength,
	validEmailExist,
	validEmailFormat,
	validPasswordLength,
	validPasswordMatches,
	validUsernameExist,
	validUsernameLength,
	validUsernameOrEmail,
} from "../services/validation/userValid";
import verifyToken from "../middleware/tokenHandler";

const router = express.Router();

const User = require("../models/User");

// ユーザー新規登録APIを呼出
router.post(
	"/register",
	validUsernameLength,
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

// パスワードリセットリクエストAPIの呼出
router.post(
	"/reset-password-request",
	async (req: express.Request, res: express.Response) => {
		resetPasswordRequest(req, res);
	}
);

// パスワードリセットAPIの呼出
router.post("/reset-password/:token", async (req, res) => {});

module.exports = router;
