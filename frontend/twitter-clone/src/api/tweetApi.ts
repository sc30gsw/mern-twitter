import { axiosClientFormData } from "./axiosClient";

const tweetApi = {
	create: (formData: FormData) =>
		axiosClientFormData.post("tweet/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
};

export default tweetApi;
