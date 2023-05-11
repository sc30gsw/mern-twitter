export type LoginUser = {
	profileName?: string;
	username?: string;
	email?: string;
	password: string;
};

export type User = LoginUser & {
	confirmPassword: string;
};

export type TweetUser = {
	_id: string;
	username: string;
	email: string;
	icon: string;
	profileName: string;
	description: string;
	profileImg: string;
	__v: number;
};
