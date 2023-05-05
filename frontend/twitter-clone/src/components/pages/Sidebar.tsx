import { Home, Notifications, Search, Twitter } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
	Badge,
	Box,
	Button,
	IconButton,
	Tooltip,
	Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Sign from "./Sign";
import { useState } from "react";
import TweetBoxDialog from "./dialog/TweetBoxDialog";

const Sidebar = () => {
	// 現在のルートを取得
	const location = useLocation();

	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const isSmallScreen = useMediaQuery("(max-width:1000px)");

	const renderButtonWithTooltip = (
		icon: any,
		text: string,
		showBadge = false
	) => {
		const button = (
			<Button
				sx={{
					padding: "10px 20px",
					borderRadius: "40px",
					":hover": { background: "#d6dfe8", border: "none" },
				}}
			>
				{showBadge ? (
					<Badge
						color="primary"
						variant="dot"
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
						sx={{ mr: 1 }}
					>
						{icon}
					</Badge>
				) : (
					icon
				)}
				<Typography
					sx={{
						color: "#14171A",
						ml: "10px",
						display: isSmallScreen ? "none" : "block",
					}}
				>
					{text}
				</Typography>
			</Button>
		);

		return isSmallScreen ? (
			<Tooltip title={text} enterDelay={800}>
				{button}
			</Tooltip>
		) : (
			button
		);
	};

	const handleOpenDialog = () => setOpenDialog(true);
	const handleCloseDialog = () => setOpenDialog(false);

	return (
		<>
			<Box
				sx={{
					height: "90vh",
					mt: "10px",
					ml: "5px",
					mr: "10px",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Link to="/">
					<IconButton
						sx={{
							padding: "10px",
							margin: "0 10px",
							":hover": { background: "#d6dfe8" },
						}}
					>
						<Twitter sx={{ color: "#1DA1F2", fontSize: "40px" }} />
					</IconButton>
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					{renderButtonWithTooltip(
						<Home sx={{ color: "#14171A", fontSize: "40px" }} />,
						"ホーム",
						location.pathname === "/"
					)}
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					{renderButtonWithTooltip(
						<Search sx={{ color: "#14171A", fontSize: "40px" }} />,
						"検索"
					)}
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					{renderButtonWithTooltip(
						<Notifications sx={{ color: "#14171A", fontSize: "40px" }} />,
						"通知"
					)}
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					{renderButtonWithTooltip(
						<EmailIcon sx={{ color: "#14171A", fontSize: "40px" }} />,
						"メッセージ"
					)}
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					{renderButtonWithTooltip(
						<PersonIcon sx={{ color: "#14171A", fontSize: "40px" }} />,
						"プロフィール"
					)}
				</Link>
				{isSmallScreen ? (
					<Tooltip title="Tweet" enterDelay={800}>
						<Box sx={{ marginTop: "10px" }}>
							<IconButton
								color="primary"
								size="large"
								sx={{
									padding: "10px",
									margin: "0 10px",
								}}
								onClick={handleOpenDialog}
							>
								<AddCircleOutlineIcon sx={{ width: "40px", height: "40px" }} />
							</IconButton>
						</Box>
					</Tooltip>
				) : (
					<Button
						sx={{
							margin: "10px 5px",
							padding: "10px 20px",
							borderRadius: "40px",
							textTransform: "none",
							fontSize: "18px",
							background: "#1DA1F2",
							color: "#fff",
							":hover": { background: "#1da0f29c" },
						}}
						onClick={handleOpenDialog}
					>
						Tweet
					</Button>
				)}
			</Box>
			<Sign />
			<TweetBoxDialog open={openDialog} onClose={handleCloseDialog} />
		</>
	);
};

export default Sidebar;
