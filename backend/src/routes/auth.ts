import express, { NextFunction } from "express";
import { validationResult } from "express-validator";
import { register } from "../services/userService";
import {
	validConfirmPasswordLength,
	validEmailExist,
	validEmailFormat,
	validPasswordLength,
	validPasswordMatches,
	validUsernameExist,
	validUsernameLength,
} from "../services/validation/userValid";

const router = express.Router();

const User = require("../models/User");

// ユーザー新規登録APIを呼び出し
router.post(
	"/register",
	validUsernameLength,
	validEmailFormat,
	validPasswordLength,
	validConfirmPasswordLength,
	validUsernameExist,
	validEmailExist,
	validPasswordMatches,
	(req: express.Request, res: express.Response, next: NextFunction) => {
		const errors = validationResult(req);
		// エラーが存在する場合
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// エラーが存在しない場合
		next();
	},
	(req: express.Request, res: express.Response) => {
		register(req, res);
	}
);

module.exports = router;
