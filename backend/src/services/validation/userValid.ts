import express, { NextFunction } from "express";
import {
	body,
	oneOf,
	ValidationChain,
	validationResult,
} from "express-validator";
import mongoose from "mongoose";

const User = require("../../models/User");

export const validUsernameLength = body("username")
	.isLength({ min: 8 })
	.withMessage("ユーザー名は8文字以上で入力してください");

export const validEmailFormat = body("email")
	.isEmail()
	.withMessage("有効なメールアドレスを入力してください")
	.normalizeEmail();

export const validPasswordLength = body("password")
	.isLength({ min: 8 })
	.withMessage("パスワードは8文字以上で入力してください");

export const validConfirmPasswordLength = body("confirmPassword")
	.isLength({ min: 8 })
	.withMessage("パスワード(確認用)は8文字以上で入力してください");

export const validUsernameExist: ValidationChain = body("username").custom(
	(value: string) => {
		return User.findOne({ username: value }).then((user: mongoose.Schema) => {
			if (user) {
				return Promise.reject("このユーザーはすでに使われています");
			}
		});
	}
);

export const validEmailExist: ValidationChain = body("email").custom(
	(value: string) => {
		return User.findOne({ email: value }).then((user: mongoose.Document) => {
			if (user) {
				return Promise.reject("このメールアドレスはすでに使われています");
			}
		});
	}
);

export const validPasswordMatches = body("confirmPassword").custom(
	(value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("パスワードが一致しません");
		}
		return true;
	}
);

export const validUsernameOrEmail = oneOf([
	[
		body("username")
			.exists()
			.withMessage("ユーザー名またはメールアドレスを入力してください")
			.isLength({ min: 8 })
			.withMessage("ユーザー名は8文字以上で入力してください"),
	],
	[
		body("email")
			.exists()
			.withMessage("ユーザー名またはメールアドレスを入力してください")
			.isEmail()
			.withMessage("有効なメールアドレスを入力してください")
			.normalizeEmail(),
	],
]);

export const printErrors = (
	req: express.Request,
	res: express.Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	// エラーが存在する場合
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// エラーが存在しない場合
	next();
};
