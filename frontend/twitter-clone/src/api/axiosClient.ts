import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL as string;

const getToken = () => localStorage.getItem("token");

export const axiosClient = axios.create({
	baseURL: BASE_URL,
});

axiosClient.interceptors.request.use(async (config: any) => {
	const token = await getToken();
	return {
		...config,
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
	};
});

axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(err) => {
		throw err.response;
	}
);
