import express from "express";
import Tweet from "../models/Tweet";

export const create = async (req: express.Request, res: express.Response) => {
	try {
		const tweet = await Tweet.create({
			userId: req.user?.id,
			content: req.body.content,
		});

		return res.status(201).json(tweet);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};
