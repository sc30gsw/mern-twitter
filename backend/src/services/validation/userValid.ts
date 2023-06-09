import express from "express";
import { body, oneOf, ValidationChain } from "express-validator";
import User from "../../models/User";

export const validUsernameLength = body("username")
	.isLength({ min: 4 })
	.withMessage("ユーザー名は4文字以上で入力してください");

export const validUsernameFormat = body("username")
	.optional()
	.matches(/^@[\w]+$/)
	.withMessage("ユーザー名は@で始まり、半角英数字のみで入力してください");

export const validProfileNameLength = body("profileName")
	.isLength({ min: 8 })
	.withMessage("名前は8文字以上で入力してください");

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
	async (value: string) => {
		const user = await User.findOne({ username: value });
		if (user) {
			throw new Error("このユーザーはすでに使われています");
		}
	}
);

export const validEmailExist = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(401).json({
				errors: [
					{
						param: "email",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		const user = await User.findOne({ email: email });

		if (user) {
			return res.status(400).json({
				errors: [
					{
						param: "email",
						msg: "このメールアドレスはすでに使われています",
					},
				],
			});
		}

		return res.status(200).json({ msg: "メールアドレスは使用可能です" });
	} catch (err) {
		return res.status(500).json(err);
	}
};

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
			.isLength({ min: 4 })
			.withMessage("ユーザー名は4文字以上で入力してください"),
	],
	[
		body("username")
			.matches(/^@[\w]+$/)
			.withMessage("ユーザー名は@で始まり、半角英数字のみで入力してください"),
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
