import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
const PORT = 4000;
const url = process.env.MONGODB_URL as string;
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());

// エンドポイント
app.use("/api", require("./routes/index"));

// DB接続
try {
	mongoose.set("strictQuery", true);
	mongoose.connect(url);
	console.log("DB接続中");
} catch (err) {
	console.log(err);
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
