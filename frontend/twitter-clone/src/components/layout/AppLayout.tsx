import Sidebar from "../pages/Sidebar";
import Home from "../pages/Home";
import { Box } from "@mui/material";
import Widgets from "../pages/Widgets";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import authUtils from "../../utils/authUtils";

const AppLayout = () => {
	const navigate = useNavigate();

	// ページ遷移ごとに発火
	useEffect(() => {
		// JWTを持っているかチェック
		const checkAuth = async () => {
			// 認証チェック
			const isAuth = await authUtils.isAuthenticated();
			if (isAuth) {
				navigate("/");
			} else {
				navigate("/auth");
			}
		};
		checkAuth();
	}, [navigate]);

	const user = false;
	return (
		<Box
			component="main"
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100vw",
				height: "100vh",
				px: "10%",
			}}
		>
			<Box
				sx={{ flex: "2", borderRight: "solid 1px #d5e5f1", height: "100vh" }}
			>
				<Sidebar />
			</Box>
			<Box
				sx={{
					flex: "6",
					height: "100vh",
					overflowY: "auto",
				}}
			>
				<Home />
			</Box>
			<Box
				sx={{
					flex: "3.5",
					borderLeft: "solid 1px #d5e5f1",
					height: "100vh",
				}}
			>
				<Widgets />
			</Box>
		</Box>
	);
};

export default AppLayout;
