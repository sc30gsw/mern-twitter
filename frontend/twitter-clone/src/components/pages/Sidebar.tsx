import { Home, Notifications, Search, Twitter } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Sign from "./Sign";

const Sidebar = () => {
	const isSmallScreen = useMediaQuery("(max-width:1000px)");
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
					<Button
						sx={{
							padding: "10px 20px",
							borderRadius: "40px",
							":hover": { background: "#d6dfe8", border: "none" },
						}}
					>
						<Home sx={{ color: "#14171A", fontSize: "40px" }} />
						<Typography
							sx={{
								color: "#14171A",
								ml: "10px",
								display: isSmallScreen ? "none" : "block",
							}}
						>
							ホーム
						</Typography>
					</Button>
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					<Button
						sx={{
							padding: "10px 20px",
							borderRadius: "40px",
							":hover": { background: "#d6dfe8", border: "none" },
						}}
					>
						<Search sx={{ color: "#14171A", fontSize: "40px" }} />
						<Typography
							sx={{
								color: "#14171A",
								ml: "10px",
								display: isSmallScreen ? "none" : "block",
							}}
						>
							検索
						</Typography>
					</Button>
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					<Button
						sx={{
							padding: "10px 20px",
							borderRadius: "40px",
							":hover": { background: "#d6dfe8", border: "none" },
						}}
					>
						<Notifications sx={{ color: "#14171A", fontSize: "40px" }} />
						<Typography
							sx={{
								color: "#14171A",
								ml: "10px",
								display: isSmallScreen ? "none" : "block",
							}}
						>
							通知
						</Typography>
					</Button>
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					<Button
						sx={{
							padding: "10px 20px",
							borderRadius: "40px",
							":hover": { background: "#d6dfe8", border: "none" },
						}}
					>
						<EmailIcon sx={{ color: "#14171A", fontSize: "40px" }} />
						<Typography
							sx={{
								color: "#14171A",
								ml: "10px",
								display: isSmallScreen ? "none" : "block",
							}}
						>
							メッセージ
						</Typography>
					</Button>
				</Link>
				<Link to="/" style={{ marginTop: "10px" }}>
					<Button
						sx={{
							padding: "10px 20px",
							borderRadius: "40px",
							":hover": { background: "#d6dfe8", border: "none" },
						}}
					>
						<PersonIcon sx={{ color: "#14171A", fontSize: "40px" }} />
						<Typography
							sx={{
								color: "#14171A",
								ml: "10px",
								display: isSmallScreen ? "none" : "block",
							}}
						>
							プロフィール
						</Typography>
					</Button>
				</Link>
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
				>
					Tweet
				</Button>
			</Box>
			<Sign />
		</>
	);
};

export default Sidebar;
