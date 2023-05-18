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
	// ツイート詳細取得API
	getTweet: (tweetId: string) => axiosClient.get(`tweet/${tweetId}`),
	// ツイートビュー数取得API
	getViewCount: (tweetId: string) => axiosClient.put(`tweet/${tweetId}/view`),
	// リツイート作成API
	createRetweet: (params: {
		userId: string;
		tweetId: string;
		originalTweetId: string | undefined;
	}) => axiosClient.post("tweet/createRetweet", params),
	// リツイート削除API
	deleteRetweet: (tweetId: string, originalTweetId: string) =>
		axiosClient.delete("tweet/deleteRetweet", {
			params: { tweetId: tweetId, originalTweetId: originalTweetId },
		}),
};

export default tweetApi;
