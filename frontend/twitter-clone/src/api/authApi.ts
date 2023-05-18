import { LoginUser, User } from "../types/User";
import { axiosClient, axiosClientFormData } from "./axiosClient";

const authApi = {
	// メールチェックAPI
	existEmail: (email: string) => axiosClient.post("auth/authUser", { email }),
	// 新規登録API
	register: (params: User) => axiosClient.post("auth/register", params),
	// ログインAPI
	login: (params: LoginUser) => axiosClient.post("auth/login", params),
	// JWT認証API
	verifyToken: (token: string) =>
		axiosClient.post("auth/verify-token", { token }),
	// パスワードリセット通知API
	forgotPassword: (param: {
		username: string | undefined;
		email: string | undefined;
	}) => axiosClient.post("auth/forgotPassword", param),
	// パスワードリセットAPI
	resetPassword: (param: {
		resetToken: string;
		password: string;
		confirmPassword: string;
	}) => axiosClient.post("auth/resetPassword", param),
	// ユーザー更新API
	update: (userId: string, formData: FormData) =>
		axiosClientFormData.patch(`auth/update/${userId}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
};

export default authApi;
