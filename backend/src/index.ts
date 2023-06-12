import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
const PORT = process.env.PORT || 4000;
const url = process.env.MONGODB_URL as string;
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

app.use(
	express.static(path.resolve(__dirname, "../../frontend/twitter-clone/build/"))
);

app.get("*", (request, response) => {
	response.sendFile(
		path.resolve(__dirname, "../../frontend/twitter-clone/build/", "index.html")
	);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
