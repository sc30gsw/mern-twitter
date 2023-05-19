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

export const update = async (req: express.Request, res: express.Response) => {
	const { tweetId } = req.params;

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

		if (!tweetId) {
			return res.status(401).json({
				errors: [
					{
						param: "userId",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		const tweet = await Tweet.findOne({ _id: tweetId, userId: req.user?.id });

		if (!tweet) {
			return res.status(404).json({
				errors: [
					{
						param: "tweetId",
						msg: "指定されたツイートが見つかりません",
					},
				],
			});
		}

		const currentTime = new Date();
		const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);
		const isWithinThirtyMinutes =
			tweet.createdAt.getTime() > thirtyMinutesAgo.getTime();

		if (tweet.updatedCount >= 5 || !isWithinThirtyMinutes) {
			return res.status(403).json({
				errors: [
					{
						param: "tweetId",
						msg: "ツイートは30分以内かつ5回までしか更新できません",
					},
				],
			});
		}

		const tweetImage = req.files
			? (req.files as Express.Multer.File[]).map((file) => file.filename)
			: [];

		const updatedTweet = await Tweet.findOneAndUpdate(
			{ _id: tweetId, userId: req?.user.id, __v: tweet.__v },
			{
				$set: {
					content: req.body.content,
					tweetImage:
						tweet.tweetImage.length !== 0 ? tweet.tweetImage : tweetImage,
				},
				$inc: {
					__v: 1,
					updatedCount: 1,
				},
			},
			{ new: true }
		);

		if (!updatedTweet) {
			return res.status(404).json({
				errors: [
					{
						param: "tweetId",
						msg: "指定されたツイートが見つかりません",
					},
				],
			});
		}

		return res.status(200).json(updatedTweet);
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

export const getViewCount = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!req.params.tweetId) {
			return res.status(401).json({
				errors: [
					{
						param: "tweetId",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		const tweet = await Tweet.findById(
			req.params.originalTweetId
				? req.params.originalTweetId
				: req.params.tweetId
		);

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

		tweet.viewCount += 1;
		await tweet.save();

		return res.status(200).json({ viewCount: tweet.viewCount });
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const getTweet = async (req: express.Request, res: express.Response) => {
	try {
		if (!req.params.tweetId) {
			return res.status(401).json({
				errors: [
					{
						param: "tweetId",
						msg: "無効なリクエストです",
					},
				],
			});
		}

		const tweet = await Tweet.findById(req.params.tweetId);

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

		if (tweet.retweet) {
			const originalTweet = await Tweet.findById(tweet.retweet.originalTweetId);
			await Tweet.findOneAndUpdate(
				{ _id: req.params.tweetId },
				{
					$set: {
						viewCount: originalTweet?.viewCount,
					},
					$inc: { __v: 1 },
				},
				{ new: true, returnNewDocument: false }
			);
		}

		const query: any = [
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
			{ $match: { _id: tweet._id, "user._id": tweet.userId } },
			{ $unwind: "$user" },
			{
				$unwind: {
					path: "$retweet.originalUser",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					"user.password": false,
					"user.resetPasswordToken": false,
					"user.resetPasswordExpires": false,
				},
			},
		];

		const tweetWithUser = await Tweet.aggregate(query);

		return res.status(200).json(tweetWithUser);
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

		const tweet = await Tweet.findById(
			req.body.originalTweetId ? req.body.originalTweetId : req.body.tweetId
		);

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

		const updatedTweet = await Tweet.findOneAndUpdate(
			{ _id: tweet._id, __v: tweet.__v },
			{
				$addToSet: {
					retweetUsers: req.user?.id,
				},
				$inc: { __v: 1 },
			},
			{ new: true, returnNewDocument: false }
		);

		if (!updatedTweet) {
			return res.status(409).json({
				errors: [
					{
						param: "updatedTweet version",
						msg: "最新のデータに更新してから実行してください",
					},
				],
			});
		}

		const tweetInRetweet = await Tweet.find({
			"retweet.originalTweetId": req.body.originalTweetId
				? req.body.originalTweetId
				: req.body.tweetId,
		});

		tweetInRetweet.map(async (tweet) => {
			await Tweet.findOneAndUpdate(
				{ _id: tweet._id, __v: tweet.__v },
				{
					$addToSet: {
						retweetUsers: req.user?.id,
					},
					$inc: { __v: 1 },
				},
				{ new: true, returnNewDocument: false }
			);
		});

		const retweet = await Tweet.create({
			userId: req.user?.id,
			content: tweet.content,
			tweetImage: tweet.tweetImage,
			retweetUsers: updatedTweet.retweetUsers,
			viewCount: tweet.viewCount,
			updateCount: tweet.updatedCount,
			retweet: {
				originalTweetId: tweet._id,
				originalUser: tweet.userId,
				originalContent: tweet.content,
				originalTweetImage: tweet.tweetImage,
				originalUpdatedCount: tweet.updatedCount,
				originalCreatedAt: tweet.createdAt,
				originalUpdatedAt: tweet.updatedAt,
				originalTweetVersion: updatedTweet.__v,
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

		const updatedTweet = await Tweet.findOneAndUpdate(
			{
				_id: tweet.retweet.originalTweetId,
			},
			{
				$pull: { retweetUsers: req.user?.id },
				$inc: { __v: 1 },
			},
			{ new: true, returnNewDocument: false }
		);

		if (!updatedTweet) {
			return res.status(409).json({
				errors: [
					{
						param: "version",
						msg: "最新のデータに更新してから実行してください",
					},
				],
			});
		}

		const tweetInRetweet = await Tweet.find({
			"retweet.originalTweetId": req.query.originalTweetId,
		});

		tweetInRetweet.map(async (tweet) => {
			await Tweet.findOneAndUpdate(
				{
					_id: tweet._id,
					__v: tweet.__v,
				},
				{
					$pull: { retweetUsers: req.user?.id },
					$inc: { __v: 1 },
				},
				{ new: true, returnNewDocument: false }
			);
		});

		const deletedTweet = await Tweet.deleteOne({
			_id: req.query.tweetId,
			userId: req.user?.id,
		});

		return res.status(200).json(deletedTweet);
	} catch (err) {
		return res.status(500).json(err);
	}
};
