import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	tweetId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Tweet",
		required: true,
	},
	content: {
		type: String,
		required: true,
		unique: true,
	},
	commentImage: [
		{
			type: String,
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Comment", commentSchema);
