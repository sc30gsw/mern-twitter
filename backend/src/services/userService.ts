import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const User = require("../models/User");

export const register = async (req: express.Request, res: express.Response) => {
	// パスワード取得
	const password = req.body.password;
	try {
		// パスワードの暗号化
		req.body.password = CryptoJS.AES.encrypt(
			password,
			process.env.PASSWORD_SECRET_KEY as string
		);

		// ユーザー新規登録
		const user = await User.create(req.body);

		// JWTトークンの発行
		const token = jwt.sign(
			{ id: user._id },
			process.env.TOKEN_SECRET_KEY as string,
			{ expiresIn: "24h" }
		);

		return res.status(200).json({ user, token });
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const login = async (req: express.Request, res: express.Response) => {
	const { username, email, password } = req.body;

	try {
		const user = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (!user) {
			return res.status(401).json({
				errors: [
					{
						param: "username or email",
						msg: "ユーザー名またはメールアドレスが無効です",
					},
				],
			});
		}

		// パスワードを復号
		const decryptedPassword = CryptoJS.AES.decrypt(
			user.password,
			process.env.TOKEN_SECRET_KEY as string
		).toString(CryptoJS.enc.Utf8);

		if (decryptedPassword !== password) {
			return res
				.status(401)
				.json({ errors: [{ param: "password", msg: "パスワードが無効です" }] });
		}

		// トークンの発行
		const token = jwt.sign(
			{ id: user._id },
			process.env.TOKEN_SECRET_KEY as string,
			{ expiresIn: "24h" }
		);

		return res.status(201).json({ user, token });
	} catch (err) {
		return res.status(500).json(err);
	}
};
