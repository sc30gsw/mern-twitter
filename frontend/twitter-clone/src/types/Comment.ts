import { TweetUser } from "./User";

export type Comment = {
	_id: string;
	userId: string;
	tweetId: string;
	content: string;
	commentImage: string[];
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	user: TweetUser;
};
