import {
	Avatar,
	Box,
	IconButton,
	MenuItem,
	MenuList,
	Popover,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserProvider";

const Sign = () => {
	const navigate = useNavigate();

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
			<IconButton
				id="sign-button"
				aria-controls={open ? "sign-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				sx={{ ":hover": { background: "#d6dfe8" } }}
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
				</Box>
			</IconButton>
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
						Log out userName
					</MenuItem>
				</MenuList>
			</Popover>
		</>
	);
};

export default Sign;
