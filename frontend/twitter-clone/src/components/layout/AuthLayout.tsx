import { Twitter } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
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
