import { axiosClient, axiosClientFormData } from "./axiosClient";

const tweetApi = {
	// ツイート登録API
	create: (formData: FormData) =>
		axiosClientFormData.post("tweet/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	// ツイート一覧検索API
	search: (content?: string) => axiosClient.post("tweet/search", { content }),
	// ユーザーツイート一覧取得API
	searchUserTweets: (username: string) =>
		axiosClient.post("tweet/searchUserTweets", { username }),
	// リツイート作成API
	createRetweet: (params: { userId: string; tweetId: string }) =>
		axiosClient.post("tweet/createRetweet", params),
	// リツイート削除API
	deleteRetweet: (tweetId: string) =>
		axiosClient.delete("tweet/deleteRetweet", { params: { tweetId: tweetId } }),
};

export default tweetApi;
