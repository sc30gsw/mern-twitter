import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";

const User = require("../models/User");

// express.Requestに拡張でUser型を追加
declare global {
	namespace Express {
		interface Request {
			user?: { id: string };
		}
	}
}

// JWTトークンを復号する処理
const tokenDecode = (req: express.Request) => {
	// リクエストヘッダーの"authorization"を取得
	const bearerHeader = req.headers.authorization;

	// 認証情報が存在する場合
	if (bearerHeader) {
		// トークンを取得
		const bearer = bearerHeader.split(" ")[1];

		try {
			// トークンを復号
			const decodedToken = jwt.verify(
				bearer,
				process.env.TOKEN_SECRET_KEY as string
			);

			return decodedToken;
		} catch {
			return false;
		}
	} else {
		return false;
	}
};

// JWTを検証するためのミドルウェア
const verifyToken = async (
	req: express.Request,
	res: express.Response,
	next: NextFunction
) => {
	// 復号したトークンを取得
	const decodedToken = tokenDecode(req);

	// トークンが存在する場合
	if (decodedToken) {
		// ユーザーを取得（トークンはもともとユーザーのIDから生成したものであるため検索可能）
		const user = await User.findById((decodedToken as any).id);

		// ユーザーが存在しない場合
		if (!user) {
			return res.status(401).json("権限がありません");
		}

		// リクエスト情報を取得したユーザーで上書き
		req.user = user;
		next();
	} else {
		return res.status(401).json("権限がありません");
	}
};

export default verifyToken;
