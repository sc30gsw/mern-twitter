import { TweetUser } from "./User";

export type Tweet = {
	_id: string;
	userId: string;
	content: string;
	tweetImage: string[];
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	user: TweetUser;
};
