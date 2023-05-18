import express from "express";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import sgMail from "@sendgrid/mail";
import User from "../models/User";

export const register = async (req: express.Request, res: express.Response) => {
	// パスワード取得
	const password = req.body.password;
	try {
		// パスワードの暗号化
		req.body.password = CryptoJS.AES.encrypt(
			password,
			process.env.PASSWORD_SECRET_KEY as string
		).toString();

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

export const forgotPassword = async (
	req: express.Request,
	res: express.Response
) => {
	const { username, email } = req.body;
	try {
		const user = await getUser(undefined, username, email);
		if (!user) {
			return res.status(400).json({
				errors: [
					{
						param: "usernameOrEmail",
						msg: "この名前またはメールアドレスのユーザーは存在しません。",
					},
				],
			});
		}

		// リセットトークンと有効期限の生成
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetExpires = Date.now() + 600000; // 10分後

		// ユーザーのリセットトークンと有効期限を更新
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = resetExpires;

		await user.save();

		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

		const msg = {
			to: user.email,
			from: "info@twitter-clone.com",
			subject: "パスワードリセットリクエスト",
			text: `
			パスワードをリセットしますか？\n\n${user.username} のパスワードのリセットをリクエストした場合は、以下のリンクを使用してプロセスを完了してください。\nhttp://localhost:3000/auth/reset/${resetToken}\n\nこのリクエストを行っていない場合は、このメールを無視してください\nこのメールは ${user.username} 宛てに送信されました\n\n@TwitterClone
		`,
		};

		await sgMail.send(msg);

		return res.status(200).json({ user });
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const resetPassword = async (
	req: express.Request,
	res: express.Response
) => {
	const { resetToken, password } = req.body;
	try {
		const user = await User.findOne({
			resetPasswordToken: resetToken,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				errors: [
					{
						param: "resetToken",
						msg: "無効なトークンまたはトークンが期限切れです。",
					},
				],
			});
		}
		// パスワードの暗号化
		req.body.password = CryptoJS.AES.encrypt(
			password,
			process.env.PASSWORD_SECRET_KEY as string
		).toString();

		// パスワード更新
		const updatedUser = await User.findOneAndUpdate(
			{ _id: user._id, __v: user.__v },
			{
				$set: {
					password: req.body.password,
					resetPasswordToken: null,
					resetPasswordExpires: null,
				},
				$inc: { __v: 1 },
			},
			{ new: true, returnNewDocument: false }
		);

		if (!updatedUser) {
			return res.status(409).json({
				errors: [
					{
						param: "version",
						msg: "最新のデータに更新してから実行してください",
					},
				],
			});
		}

		return res.status(200).json({ updatedUser });
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const updateUser = async (
	req: express.Request,
	res: express.Response
) => {
	const { profileName, description } = req.body;
	const { userId } = req.params;
	try {
		if (!userId) {
			return res.status(401).json({
				errors: [
					{
						param: "userId",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		const user = await getUser(userId, undefined, undefined);

		if (!user) {
			return res.status(404).json({
				errors: [
					{
						param: "user",
						msg: "ユーザーが存在しません",
					},
				],
			});
		}

		let profileImgUrl: any;
		let iconUrl: any;

		const files: any = req.files;
		if (files) {
			if (files["profileImg"]) {
				profileImgUrl = files["profileImg"][0].filename;
			}

			if (files["icon"]) {
				iconUrl = files["icon"][0].filename;
			}
		}

		const updatedUser = await User.findOneAndUpdate(
			{ _id: user._id, __v: user.__v },
			{
				$set: {
					profileName: profileName,
					description: description,
					icon: iconUrl,
					profileImg: profileImgUrl,
				},
				$inc: { __v: 1 },
			},
			{ new: true, returnNewDocument: false }
		);

		if (!updatedUser) {
			return res.status(409).json({
				errors: [
					{
						param: "version",
						msg: "最新のデータに更新してから実行してください",
					},
				],
			});
		}

		return res.status(200).json({ updatedUser });
	} catch (err) {
		return res.status(500).json(err);
	}
};

const getUser = async (
	userId: string | undefined,
	username: string | undefined,
	email: string | undefined
) => {
	const user = await User.findOne({
		$or: [{ _id: userId }, { username: username }, { email: email }],
	});

	return user;
};
