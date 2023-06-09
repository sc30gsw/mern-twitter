import { Box } from "@mui/material";
import Sidebar from "../pages/Sidebar";
import AccountButtonArea from "../pages/AccountButtonArea";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
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
				<Outlet />
			</Box>
			<Box
				sx={{
					flex: "3.5",
					borderLeft: "solid 1px #d5e5f1",
					height: "100vh",
				}}
			>
				<AccountButtonArea />
			</Box>
		</Box>
	);
};

export default AuthLayout;
