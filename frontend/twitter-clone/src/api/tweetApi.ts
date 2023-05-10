import { axiosClient, axiosClientFormData } from "./axiosClient";

const tweetApi = {
	create: (formData: FormData) =>
		axiosClientFormData.post("tweet/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	search: (content?: string) => axiosClient.post("tweet/search", { content }),
};

export default tweetApi;
