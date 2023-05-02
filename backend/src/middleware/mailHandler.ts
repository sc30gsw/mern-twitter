import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";

const User = require("../models/User");

const transporter = nodemailer.createTransport(
	sgTransport({
		auth: {
			api_key: process.env.SENDGRID_API_KEY as string,
		},
	})
);

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const mailOptions = {
		from: "no-reply@example.com", // 送信者のメールアドレス
		to: email, // 受信者のメールアドレス
		subject: "パスワードリセット",
		text: `パスワードリセットリンク: ${process.env.CLIENT_URL}/reset-password/${token}`,
	};

	await transporter.sendMail(mailOptions);
};
