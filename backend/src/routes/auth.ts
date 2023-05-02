import express, { NextFunction } from "express";
import { validationResult } from "express-validator";
import { login, register } from "../services/userService";
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
import { verify } from "crypto";
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

module.exports = router;
