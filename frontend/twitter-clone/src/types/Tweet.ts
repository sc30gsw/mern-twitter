import { TweetUser } from "./User";

type Retweet = {
	originalTweetId: string;
	originalUser: TweetUser;
	originalContent: string;
	originalTweetImage: string[];
	originalCreatedAt: Date;
	originalUpdatedAt: Date;
};

export type Tweet = {
	_id: string;
	userId: string;
	content: string;
	tweetImage: string[];
	retweet: Retweet;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	user: TweetUser;
};
