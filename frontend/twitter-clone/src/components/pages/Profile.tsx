import {
	Avatar,
	Box,
	Button,
	IconButton,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUserContext } from "../../contexts/UserProvider";
import { Link } from "react-router-dom";
import TweetList from "./TweetList";
import { useState } from "react";
import EditProfileDialog from "./dialog/EditProfileDialog";

const Profile = () => {
	const { user } = useUserContext();
	const [tabValue, setTabValue] = useState<number>(0);
	const [open, setOpen] = useState<boolean>(false);

	const handleTabChange = (e: React.ChangeEvent<any>, newValue: number) =>
		setTabValue(newValue);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	return (
		<>
			<Box
				sx={{
					height: "100vh",
					margin: "10px 10px 0",
					maxWidth: 500,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<IconButton component={Link} to={"/"}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ ml: "20px" }}>
						<Typography sx={{ fontWeight: "bold" }}>
							{user?.profileName}
						</Typography>
						<Typography variant="caption" display="block">
							3 Tweets
						</Typography>
					</Box>
				</Box>
				<Box sx={{ mt: 2, mb: 3, textAlign: "center" }}>
					<Box
						sx={{
							bgcolor: "red",
							width: "100%",
							height: "150px",
							position: "relative",
						}}
					>
						<Avatar
							src={user?.icon || ""}
							alt={user?.profileName}
							sx={{
								width: 70,
								height: 70,
								position: "absolute",
								bottom: -30,
								left: 10,
							}}
						/>
					</Box>
					<Button
						variant="outlined"
						size="small"
						sx={{
							textTransform: "none",
							float: "right",
							mr: 1,
							mt: "5px",
							borderRadius: "30px",
						}}
						onClick={handleOpen}
					>
						Edit profile
					</Button>
					<Box sx={{ mt: 4, ml: 1, textAlign: "left" }}>
						<Typography sx={{ fontWeight: "bold", mt: 1 }}>
							{user?.profileName}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{user?.username}
						</Typography>
						<Typography mt={2} variant="body2">
							■未経験から5ヶ月でエンジニアへ転職👨‍💻 ■自社開発2社・自社開発 + SES
							1社内定 ■地方公務員 → 第二新卒総合職 → エンジニア
							■Java・Ruby・JavaScript・TypeScript・SpringBoot・Rails・React
							■ライフハックなスローライフを送りたい😌
						</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
						<Link to="#" style={{ textDecoration: "none" }}>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ ":hover": { textDecoration: "underline" } }}
							>
								<span
									style={{
										marginRight: "5px",
										color: "black",
										fontWeight: "bold",
									}}
								>
									30
								</span>
								Followings
							</Typography>
						</Link>
						<Link to="#" style={{ textDecoration: "none" }}>
							<Typography
								ml={2}
								variant="body2"
								color="text.secondary"
								sx={{ ":hover": { textDecoration: "underline" } }}
							>
								<span
									style={{
										marginRight: "5px",
										color: "black",
										fontWeight: "bold",
									}}
								>
									50
								</span>
								Followers
							</Typography>
						</Link>
					</Box>
					<Box
						sx={{
							mt: 2,
						}}
					>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							variant="fullWidth"
							textColor="inherit"
							indicatorColor="primary"
							sx={{
								display: "flex",
								justifyContent: "space-around",
							}}
						>
							<Tab
								label="Tweets"
								component={Link}
								to="#"
								sx={{
									textTransform: "none",
									fontWeight: "bold",
									fontSize: "18px",
								}}
							/>
							<Tab
								label="Media"
								component={Link}
								to="#"
								sx={{
									textTransform: "none",
									fontWeight: "bold",
									fontSize: "18px",
								}}
							/>
							<Tab
								label="Likes"
								component={Link}
								to="#"
								sx={{
									textTransform: "none",
									fontWeight: "bold",
									fontSize: "18px",
								}}
							/>
						</Tabs>
					</Box>
				</Box>
				<TweetList />
			</Box>
			<EditProfileDialog open={open} onClose={handleClose} />
		</>
	);
};

export default Profile;
