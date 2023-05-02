import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendPasswordResetEmail } from "../middleware/mailHandler";
import { tokenDecode } from "../middleware/tokenHandler";

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

export const resetPasswordRequest = async (
	req: express.Request,
	res: express.Response
) => {
	const { email } = req.body.email;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ message: "このメールアドレスのユーザーは存在しません。" });
		}

		const token = jwt.sign(
			{ id: user._id },
			process.env.TOKEN_SECRET_KEY as string,
			{ expiresIn: "1h" }
		);
		// ユーザーにパスワードリセットメールを送信
		await sendPasswordResetEmail(email, token);

		res
			.status(200)
			.json({ message: "パスワードリセットメールを送信しました。" });
	} catch (error) {
		res.status(500).json({ error: "エラーが発生しました。" });
	}
};

export const passwordReset = async (
	req: express.Request,
	res: express.Response
) => {
	const { password } = req.body.password;

	try {
		// 復号したトークンを取得
		const decodedToken = tokenDecode(req);

		// ユーザーIDを取得し、ユーザーが存在するか確認
		const user = await User.findById((decodedToken as any).id);

		if (!user) {
			return res.status(400).json({ error: "ユーザーが見つかりません。" });
		}

		// 新しいパスワードの暗号化
		req.body.password = CryptoJS.AES.encrypt(
			password,
			process.env.PASSWORD_SECRET_KEY as string
		);

		// 新しいパスワードでユーザーパスワードを更新
		user.password = req.body.password;
		await user.save();

		res.status(200).json({ message: "パスワードが正常に更新されました。" });
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(400).json({ error: "無効なトークンです。" });
		}
		res.status(500).json({ error: "エラーが発生しました。" });
	}
};
