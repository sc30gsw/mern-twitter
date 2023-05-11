import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	resetPasswordToken: {
		type: String,
		default: null,
	},
	resetPasswordExpires: {
		type: Number,
		default: null,
	},
	icon: {
		type: String,
		default: "",
	},
	profileName: {
		type: String,
		required: true,
	},
	profileImg: {
		type: String,
		default: "",
	},
	description: {
		type: String,
		default: "",
	},
});

export default mongoose.model("User", userSchema);
