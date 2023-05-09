import express from "express";
import Tweet from "../models/Tweet";

export const create = async (req: express.Request, res: express.Response) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({
				errors: [
					{
						param: "userId",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		const tweetImage = req.files
			? (req.files as Express.Multer.File[]).map((file) => file.filename)
			: [];

		const tweet = await Tweet.create({
			userId: req.user?.id,
			content: req.body.content,
			tweetImage: tweetImage,
		});

		return res.status(201).json(tweet);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};
