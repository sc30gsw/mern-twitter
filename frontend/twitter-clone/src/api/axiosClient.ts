import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL as string;
const BASE_URL = "https://twitter-heroku.herokuapp.com/api";

const getToken = () => localStorage.getItem("token");

const createInstance = (config = {}) => {
	const instance = axios.create({
		baseURL: BASE_URL,
		...config,
	});

	instance.interceptors.request.use(async (conf: any) => {
		const token = await getToken();
		return {
			...conf,
			headers: {
				...conf.headers,
				authorization: `Bearer ${token}`,
			},
		};
	});

	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		(err) => {
			throw err.response;
		}
	);

	return instance;
};

export const axiosClient = createInstance();
export const axiosClientFormData = createInstance({
	headers: { "Content-Type": "multipart/form-data" },
});
