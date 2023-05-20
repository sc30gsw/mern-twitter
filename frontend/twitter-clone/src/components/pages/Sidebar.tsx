import { Home, Notifications, Search, Twitter } from "@mui/icons-material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import EmailIcon from "@mui/icons-material/Email";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
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
import TweetBoxDialog from "./dialog/TweetBoxDialog";
import { useUserContext } from "../../contexts/UserProvider";
import { useTweetBoxDialogContext } from "../../contexts/TweetBoxDialogProvider";

const Sidebar = () => {
	// 現在のルートを取得
	const location = useLocation();

	const { user } = useUserContext();
	const { openDialog, setOpenDialog } = useTweetBoxDialogContext();

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
						location.pathname === "/" ? (
							<Home sx={{ color: "#14171A", fontSize: "40px" }} />
						) : (
							<HomeOutlinedIcon sx={{ color: "#14171A", fontSize: "40px" }} />
						),
						"ホーム",
						location.pathname === "/"
					)}
				</Link>
				{user && (
					<>
						<Link to="/" style={{ marginTop: "10px" }}>
							{renderButtonWithTooltip(
								location.pathname === "/search" ? (
									<Search sx={{ color: "#14171A", fontSize: "40px" }} />
								) : (
									<SearchOutlinedIcon
										sx={{ color: "#14171A", fontSize: "40px" }}
									/>
								),
								"検索",
								location.pathname === "/search"
							)}
						</Link>
						<Link to="/" style={{ marginTop: "10px" }}>
							{renderButtonWithTooltip(
								location.pathname === "/notice" ? (
									<Notifications sx={{ color: "#14171A", fontSize: "40px" }} />
								) : (
									<NotificationsNoneOutlinedIcon
										sx={{ color: "#14171A", fontSize: "40px" }}
									/>
								),
								"通知",
								location.pathname === "/notice"
							)}
						</Link>
						<Link to="/" style={{ marginTop: "10px" }}>
							{renderButtonWithTooltip(
								location.pathname === "/message" ? (
									<EmailIcon sx={{ color: "#14171A", fontSize: "40px" }} />
								) : (
									<EmailOutlinedIcon
										sx={{ color: "#14171A", fontSize: "40px" }}
									/>
								),
								"メッセージ",
								location.pathname === "/message"
							)}
						</Link>
						<Link
							to={`/user/${user.username.split("@").join("")}`}
							style={{ marginTop: "10px" }}
						>
							{renderButtonWithTooltip(
								location.pathname ===
									`/user/${user.username.split("@").join("")}` ? (
									<PersonIcon sx={{ color: "#14171A", fontSize: "40px" }} />
								) : (
									<PersonOutlineOutlinedIcon
										sx={{ color: "#14171A", fontSize: "40px" }}
									/>
								),
								"プロフィール",
								location.pathname ===
									`/user/${user.username.split("@").join("")}`
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
										<AddCircleOutlineIcon
											sx={{ width: "40px", height: "40px" }}
										/>
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
					</>
				)}
			</Box>
			{user && <Sign isSmallScreen={isSmallScreen} />}
			<TweetBoxDialog open={openDialog} onClose={handleCloseDialog} />
		</>
	);
};

export default Sidebar;
