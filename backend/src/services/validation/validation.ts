import express, { NextFunction } from "express";
import { validationResult } from "express-validator";

export const printErrors = (
	req: express.Request,
	res: express.Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	// エラーが存在する場合
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// エラーが存在しない場合
	next();
};
