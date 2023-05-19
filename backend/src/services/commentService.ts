import express from "express";
import Comment from "../models/Comment";

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

		if (!req.body.tweetId) {
			return res.status(401).json({
				errors: [
					{
						param: "tweetId",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		const commentImage = req.files
			? (req.files as Express.Multer.File[]).map((file) => file.filename)
			: [];

		const comment = await Comment.create({
			userId: req.user?.id,
			tweetId: req.body.tweetId,
			content: req.body.content,
			commentImage: commentImage,
		});

		return res.status(201).json(comment);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};
