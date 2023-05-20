import express from "express";
import Comment from "../models/Comment";
import mongoose from "mongoose";

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

export const getComments = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		console.log(req.body.tweetId);
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

		let query: any = [
			{ $match: { tweetId: new mongoose.Types.ObjectId(req.body.tweetId) } },
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
			{
				$project: {
					"user.password": false,
					"user.resetPasswordToken": false,
					"user.resetPasswordExpires": false,
				},
			},
		];

		const comments = await Comment.aggregate(query);
		console.log(comments);
		return res.status(200).json(comments);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
};
