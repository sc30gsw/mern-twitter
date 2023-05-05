export type LoginUser = {
	profileName?: string;
	username?: string;
	email?: string;
	password: string;
};

export type User = LoginUser & {
	confirmPassword: string;
};
