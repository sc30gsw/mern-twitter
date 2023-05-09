import express, { NextFunction } from "express";
import { body } from "express-validator";

export const validContentLength = body("content")
	.isLength({ max: 140 })
	.withMessage("ツイートは140文字以下で入力してください");
