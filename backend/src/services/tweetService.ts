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
		return res.status(500).json(err);
	}
};

export const searchTweets = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		let query: any = [
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{ $sort: { updatedAt: -1 } },
			{ $project: { "user.password": false } },
		];

		if (req.body.content) {
			query.push({
				$match: { content: { $regex: req.body.content, $options: "i" } },
			});
		}

		const tweets = await Tweet.aggregate(query);
		return res.status(200).json(tweets);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};

export const searchUserTweets = async (
	req: express.Request,
	res: express.Response
) => {
	const { username } = req.body;
	try {
		if (!username) {
			return res.status(401).json({
				errors: [
					{
						param: "username",
						msg: "無効なリクエストです",
					},
				],
			});
		}
		let query: any = [
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $match: { "user.username": username } },
			{ $unwind: "$user" },
			{ $sort: { updatedAt: -1 } },
			{ $project: { "user.password": false } },
		];

		const tweets = await Tweet.aggregate(query);

		return res.status(200).json(tweets);
	} catch (err) {
		return res.status(500).json(err);
	}
};
