import Sidebar from "../pages/Sidebar";
import Home from "../pages/Home";
import { Box } from "@mui/material";
import Widgets from "../pages/Widgets";
import AccountButtonArea from "../pages/AccountButtonArea";

const AppLayout = () => {
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
				{user ? <Widgets /> : <AccountButtonArea />}
			</Box>
		</Box>
	);
};

export default AppLayout;
