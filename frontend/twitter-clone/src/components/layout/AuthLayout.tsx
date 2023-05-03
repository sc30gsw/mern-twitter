import { Twitter } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";

const AuthLayout = () => {
	const navigate = useNavigate();

	// ページ遷移ごとに発火
	useEffect(() => {
		// JWTを持っているかチェック
		const checkAuth = async () => {
			// 認証チェック
			const isAuth = await authUtils.isAuthenticated();
			if (isAuth) {
				navigate("/");
			}
		};
		checkAuth();
	}, [navigate]);

	return (
		<Box>
			<Container component="main" maxWidth="xs">
				<Box
					sx={{
						mt: 6,
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<Twitter sx={{ color: "#1DA1F2", fontSize: "100px" }} />
					<Typography variant="h4" gutterBottom>
						Twitterクローン
					</Typography>
				</Box>
				<Outlet />
			</Container>
		</Box>
	);
};

export default AuthLayout;
