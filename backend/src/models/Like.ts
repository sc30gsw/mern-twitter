import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
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
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Like", likeSchema);
