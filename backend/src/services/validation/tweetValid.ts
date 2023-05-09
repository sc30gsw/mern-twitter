import express, { NextFunction } from "express";
import { body } from "express-validator";
import Tweet from "../../models/Tweet";

export const validContentLength = body("content")
	.isLength({ max: 140 })
	.withMessage("ツイートは140文字以下で入力してください");

export const validImageCount = (
	req: express.Request,
	res: express.Response,
	next: NextFunction
) => {
	if (!req.files || (req.files as any).tweetImage.length > 4) {
		return res.status(400).json({
			errors: [
				{
					param: "tweetImage",
					msg: "画像は4枚までアップロードできます",
				},
			],
		});
	}
	next();
};
