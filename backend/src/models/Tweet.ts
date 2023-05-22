import mongoose from "mongoose";

const retweetSchema = new mongoose.Schema({
	originalTweetId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Tweet",
		required: true,
	},
	originalUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	originalContent: {
		type: String,
		required: true,
	},
	originalTweetImage: [
		{
			type: String,
		},
	],
	originalUpdatedCount: {
		type: Number,
	},
	originalCreatedAt: {
		type: Date,
		required: true,
	},
	originalUpdatedAt: {
		type: Date,
		required: true,
	},
	originalTweetVersion: {
		type: Number,
		required: true,
	},
});

const tweetSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	tweetImage: [
		{
			type: String,
		},
	],
	retweet: retweetSchema,
	retweetUsers: [
		{
			type: String,
		},
	],
	viewCount: {
		type: Number,
		default: 0,
	},
	updatedCount: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Tweet", tweetSchema);
