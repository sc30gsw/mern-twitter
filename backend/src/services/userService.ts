import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User";
import fs from "fs";

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

		return res.status(200).json({ user });
	} catch (err) {
		res.status(500).json(err);
	}
};

export const resetPassword = async (
	req: express.Request,
	res: express.Response
) => {
	const { username, email, password } = req.body;
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

		// パスワードの暗号化
		req.body.password = CryptoJS.AES.encrypt(
			password,
			process.env.PASSWORD_SECRET_KEY as string
		).toString();

		// パスワード更新
		const updatedUser = await User.findOneAndUpdate(
			{ _id: user._id, __v: user.__v },
			{
				$set: { password: req.body.password },
				$inc: { __v: 1 },
			},
			{ new: true, returnOriginal: false }
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
	const { userId, profileName, description } = req.body;
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

		let profileImgUrl: any = null;
		let iconUrl: any = null;

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
			{ new: true, returnOriginal: false }
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
		console.log(err);
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
