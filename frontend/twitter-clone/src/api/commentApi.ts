import { axiosClientFormData } from "./axiosClient";

const commentApi = {
	// コメント登録API
	create: (formData: FormData) =>
		axiosClientFormData.post("comment/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
};

export default commentApi;
