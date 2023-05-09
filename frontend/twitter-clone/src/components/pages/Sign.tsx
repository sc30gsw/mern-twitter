import {
	Avatar,
	Box,
	Button,
	MenuItem,
	MenuList,
	Popover,
	Typography,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserProvider";

type SignProps = {
	isSmallScreen: boolean;
};

const Sign = ({ isSmallScreen }: SignProps) => {
	const navigate = useNavigate();
	const { user } = useUserContext();

	const { setUser, triggerLogoutEvent } = useUserContext();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(e.currentTarget);

	const handleClose = () => setAnchorEl(null);

	const logout = () => {
		setAnchorEl(null);

		localStorage.removeItem("token");
		setUser(undefined);
		console.log("ログアウトしました");
		triggerLogoutEvent();
		navigate("/auth");
	};

	return (
		<>
			<Button
				id="sign-button"
				aria-controls={open ? "sign-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				sx={{
					borderRadius: isSmallScreen ? "50%" : 0,
					textTransform: "none",
					":hover": {
						background: "#d6dfe8",
					},
				}}
			>
				<Box
					sx={{
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Avatar src="" alt="K" sx={{ width: "60px", height: "60px" }} />
					{!isSmallScreen && (
						<Typography
							sx={{ margin: "0 5px", fontWeight: "bold", color: "#979fa7" }}
						>
							{user?.profileName}
						</Typography>
					)}
				</Box>
			</Button>
			<Popover
				id="sign-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			>
				<MenuList>
					<MenuItem onClick={logout}>
						<LogoutOutlinedIcon />
						Logout {user?.username}
					</MenuItem>
				</MenuList>
			</Popover>
		</>
	);
};

export default Sign;
