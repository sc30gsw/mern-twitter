import { body } from "express-validator";
import Tweet from "../../models/Tweet";

export const validContentLength = body("content")
	.isLength({ max: 140 })
	.withMessage("ツイートは140文字以下で入力してください");
