import express from "express";
import Like from "../models/Like";
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

		const tweet = await Tweet.findById(req.body.tweetId);

		let likes = [];
		if ((tweet?.retweetUsers.length as number) > 0) {
			const retweets = await Tweet.find({
				"retweet.originalTweetId": tweet?.retweet
					? tweet.retweet.originalTweetId
					: req.body.tweetId,
			});
			retweets.map(async (tweet) => {
				const like = await Like.create({
					userId: req.user?.id,
					tweetId: tweet._id,
				});
				likes.push(like);
			});

			const like = await Like.create({
				userId: req.user?.id,
				tweetId: tweet?.retweet
					? tweet.retweet.originalTweetId
					: req.body.tweetId,
			});

			likes.push(like);
		} else {
			const like = await Like.create({
				userId: req.user?.id,
				tweetId: req.body.tweetId,
			});
			likes.push(like);
		}

		return res.status(201).json(likes);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const getUserLike = async (
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

		const like = await Like.findOne({
			userId: req.user?.id,
			tweetId: req.body.tweetId,
		});

		return res.status(200).json(like);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const getLikes = async (req: express.Request, res: express.Response) => {
	try {
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

		const tweet = await Tweet.findById(req.body.tweetId);

		let likes;
		if (tweet?.retweet) {
			likes = await Like.find({
				tweetId: tweet.retweet.originalTweetId,
			});
		} else {
			likes = await Like.find({
				tweetId: req.body.tweetId,
			});
		}

		return res.status(200).json(likes);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const deleteLike = async (
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

		const tweet = await Tweet.findById(req.query.tweetId);

		let likes = [];
		if ((tweet?.retweetUsers.length as number) > 0) {
			const retweets = await Tweet.find({
				"retweet.originalTweetId": tweet?.retweet
					? tweet.retweet.originalTweetId
					: req.query.tweetId,
			});

			retweets.map(async (tweet) => {
				const like = await Like.deleteOne({
					userId: req.user?.id,
					tweetId: tweet._id,
				});
				likes.push(like);
			});

			const like = await Like.deleteOne({
				userId: req.user?.id,
				tweetId: tweet?.retweet
					? tweet.retweet.originalTweetId
					: req.query.tweetId,
			});

			likes.push(like);
		} else {
			const like = await Like.deleteOne({
				userId: req.user?.id,
				tweetId: req.query.tweetId,
			});
			likes.push(like);
		}

		return res.status(200).json(likes);
	} catch (err) {
		return res.status(500).json(err);
	}
};
