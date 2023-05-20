import { axiosClient, axiosClientFormData } from "./axiosClient";

const commentApi = {
	// コメント登録API
	create: (formData: FormData) =>
		axiosClientFormData.post("comment/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	// コメント一覧取得API
	getComments: (tweetId: string) =>
		axiosClient.post("comment/getComments", { tweetId }),
};

export default commentApi;
