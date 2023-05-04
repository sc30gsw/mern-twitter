import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Sign = () => {
	return (
		<IconButton sx={{ ":hover": { background: "#d6dfe8" } }}>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Avatar src="" alt="K" sx={{ width: "60px", height: "60px" }} />
				{/* <IconButton>
					<LogoutOutlinedIcon />
				</IconButton> */}
			</Box>
		</IconButton>
	);
};

export default Sign;
