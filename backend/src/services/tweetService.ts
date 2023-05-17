import express from "express";
import Tweet from "../models/Tweet";
import User from "../models/User";
import { ObjectId } from "mongoose-typescript";

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
			{
				$lookup: {
					from: "users",
					localField: "retweet.originalUser",
					foreignField: "_id",
					as: "retweet.originalUser",
				},
			},
			{ $unwind: "$user" },
			{
				$unwind: {
					path: "$retweet.originalUser",
					preserveNullAndEmptyArrays: true,
				},
			},
			{ $sort: { updatedAt: -1 } },
			{
				$project: {
					"user.password": false,
					"user.resetPasswordToken": false,
					"user.resetPasswordExpires": false,
					"retweet.originalUser.password": false,
					"retweet.originalUser.resetPasswordToken": false,
					"retweet.originalUser.resetPasswordExpires": false,
				},
			},
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
			{
				$lookup: {
					from: "users",
					localField: "retweet.originalUser",
					foreignField: "_id",
					as: "retweet.originalUser",
				},
			},
			{ $match: { "user.username": username } },
			{ $unwind: "$user" },
			{
				$unwind: {
					path: "$retweet.originalUser",
					preserveNullAndEmptyArrays: true,
				},
			},
			{ $sort: { updatedAt: -1 } },
			{
				$project: {
					"user.password": false,
					"user.resetPasswordToken": false,
					"user.resetPasswordExpires": false,
				},
			},
		];

		const tweets = await Tweet.aggregate(query);

		return res.status(200).json(tweets);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const createRetweet = async (
	req: express.Request,
	res: express.Response
) => {
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

		let tweet = await Tweet.findById(req.body.tweetId);

		if (!tweet) {
			return res.status(400).json({
				errors: [
					{
						param: "tweet",
						msg: "ツイートが存在しません",
					},
				],
			});
		}

		const retweet = await Tweet.create({
			userId: req.user?.id,
			content: tweet.content,
			tweetImage: tweet.tweetImage,
			retweet: {
				originalTweetId: tweet._id,
				originalUser: tweet.userId,
				originalContent: tweet.content,
				originalTweetImage: tweet.tweetImage,
				originalCreatedAt: tweet.createdAt,
				originalUpdatedAt: tweet.updatedAt,
			},
		});

		return res.status(201).json(retweet);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const deleteRetweet = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const tweet = await Tweet.findById(req.query.tweetId);
		if (!tweet || !tweet.retweet) {
			return res.status(400).json({
				errors: [
					{
						param: "tweet",
						msg: "ツイートが存在しません",
					},
				],
			});
		}

		const deletedTweet = await Tweet.deleteOne({ _id: req.query.tweetId });

		return res.status(200).json(deletedTweet);
	} catch (err) {
		return res.status(500).json(err);
	}
};

const getFirstRetweet = async (tweetId: ObjectId) => {
	try {
		if (!tweetId) {
			return {
				errors: [
					{
						param: "tweetId",
						msg: "無効なリクエストです",
					},
				],
			};
		}

		const tweet = await Tweet.findOne({ _id: tweetId });

		return tweet;
	} catch (err) {
		return err;
	}
};

export const countRetweet = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!req.body.tweetId) {
			return res.status(400).json({
				errors: [
					{
						param: "tweetId",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		// const retweetCount;
	} catch (err) {
		return res.status(500).json(err);
	}
};
