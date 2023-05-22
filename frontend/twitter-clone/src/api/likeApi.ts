import { axiosClient } from "./axiosClient";

const likeApi = {
	// いいね登録API
	create: (tweetId: string) => axiosClient.post("like/create", { tweetId }),
	// いいね一覧取得API
	getLikes: (tweetId: string) => axiosClient.post("like/getLikes", { tweetId }),
	// いいね取得API
	getUserLike: (tweetId: string) =>
		axiosClient.post("like/getUserLike", { tweetId }),
	// いいね削除API
	delete: (tweetId: string) =>
		axiosClient.delete("like/delete", {
			params: { tweetId: tweetId },
		}),
};

export default likeApi;
