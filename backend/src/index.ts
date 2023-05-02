import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const PORT = 4000;
const url = process.env.MONGODB_URL as string;

app.use(express.json());

// DB接続
try {
	mongoose.set("strictQuery", true);
	mongoose.connect(url);
	console.log("DB接続完了");
} catch (err) {
	console.log(err);
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
