import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	IconButton,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TweetList from "./TweetList";
import { useEffect, useState } from "react";
import EditProfileDialog from "./dialog/EditProfileDialog";
import tweetApi from "../../api/tweetApi";
import { TweetUser } from "../../types/User";
import { Tweet } from "../../types/Tweet";
import { useUserContext } from "../../contexts/UserProvider";
import authApi from "../../api/authApi";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

const Profile = () => {
	const pathname = useLocation().pathname;
	const { user } = useUserContext();

	const navigate = useNavigate();
	const goBack = () => navigate(-1);

	const [loading, setLoading] = useState<boolean>(true);
	const [tabValue, setTabValue] = useState<number>(0);
	const [profileUser, setProfileUser] = useState<TweetUser>({} as TweetUser);
	const [tweets, setTweets] = useState<Tweet[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [follow, setFollow] = useState<boolean>(false);

	useEffect(() => {
		const getUserTweets = async () => {
			try {
				const username = pathname.replace("/user/", "");

				const res = await tweetApi.searchUserTweets(`@${username}`);
				setTweets(res.data);
				if (res.data.length !== 0) {
					setProfileUser(res.data[0].user);
				} else {
					const user = JSON.parse(localStorage.getItem("user") as string);
					setProfileUser(user);
				}
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};

		getUserTweets();
	}, [pathname, setTweets]);

	const handleTabChange = (e: React.ChangeEvent<any>, newValue: number) =>
		setTabValue(newValue);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleFollow = async () => {
		try {
			const username = `@${pathname.replace("/user/", "")}`;
			await authApi.follow(username);

			const res = await tweetApi.searchUserTweets(username);
			setTweets(res.data);
			if (res.data.length !== 0) {
				setProfileUser(res.data[0].user);
			} else {
				const user = JSON.parse(localStorage.getItem("user") as string);
				setProfileUser(user);
			}
			console.log("ユーザーのフォローに成功しました");
		} catch (err) {
			console.log(err);
		}
	};

	const handleUnfollow = async () => {
		try {
			const username = `@${pathname.replace("/user/", "")}`;
			await authApi.unfollow(username);

			const res = await tweetApi.searchUserTweets(username);
			setTweets(res.data);
			if (res.data.length !== 0) {
				setProfileUser(res.data[0].user);
			} else {
				const user = JSON.parse(localStorage.getItem("user") as string);
				setProfileUser(user);
			}

			console.log("ユーザーのフォロー解除に成功しました");
		} catch (err) {
			console.log(err);
		}
	};

	console.log(profileUser);

	return (
		<>
			{loading ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
					}}
				>
					<CircularProgress />
				</Box>
			) : (
				<Box
					sx={{
						height: "100vh",
						margin: "10px 10px 0",
						maxWidth: 500,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<IconButton onClick={goBack}>
							<ArrowBackIcon />
						</IconButton>
						<Box sx={{ ml: "20px" }}>
							<Typography sx={{ fontWeight: "bold" }}>
								{profileUser?.profileName}
							</Typography>
							<Typography variant="caption" display="block">
								{tweets.length} Tweets
							</Typography>
						</Box>
					</Box>
					<Box sx={{ mt: 2, mb: 3, textAlign: "center" }}>
						<Box
							sx={{
								backgroundImage: `url(${IMAGE_URL + profileUser?.profileImg})`,
								width: "100%",
								height: "150px",
								position: "relative",
							}}
						>
							<Avatar
								src={IMAGE_URL + profileUser?.icon}
								alt={profileUser?.profileName}
								sx={{
									width: 70,
									height: 70,
									position: "absolute",
									bottom: -30,
									left: 10,
								}}
							/>
						</Box>
						{`@${pathname.replace("/user/", "")}` === user?.username ? (
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
						) : !profileUser?.followers?.includes(user?._id as string) ? (
							<Button
								variant="outlined"
								size="large"
								sx={{
									textTransform: "none",
									float: "right",
									color: "white",
									background: "black",
									mr: 1,
									mt: "5px",
									borderRadius: "30px",
									fontWeight: "bold",
									":hover": {
										color: "white",
										background: "black",
										border: "1px solid black",
										opacity: 0.7,
									},
								}}
								onClick={handleFollow}
							>
								Following
							</Button>
						) : (
							<>
								{!follow ? (
									<Button
										variant="outlined"
										size="large"
										sx={{
											textTransform: "none",
											float: "right",
											color: "black",
											background: "white",
											border: "1px solid black",
											mr: 1,
											mt: "5px",
											borderRadius: "30px",
											fontWeight: "bold",
											":hover": {
												border: "1px solid red",
											},
										}}
										onMouseEnter={() => setFollow(true)}
									>
										Follow
									</Button>
								) : (
									<Button
										variant="outlined"
										size="large"
										sx={{
											textTransform: "none",
											float: "right",
											color: "red",
											background: "white",
											border: "1px solid red",
											mr: 1,
											mt: "5px",
											borderRadius: "30px",
											fontWeight: "bold",
											":hover": {
												border: "1px solid red",
											},
										}}
										onClick={handleUnfollow}
										onMouseLeave={() => setFollow(false)}
									>
										Unfollow
									</Button>
								)}
							</>
						)}
						<Box sx={{ mt: 4, ml: 1, textAlign: "left" }}>
							<Typography sx={{ fontWeight: "bold", mt: 1 }}>
								{profileUser?.profileName}
							</Typography>
							<Typography variant="body1" color="text.secondary">
								{profileUser?.username}
							</Typography>
							<Typography mt={2} variant="body2">
								{profileUser?.description}
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
										{profileUser?.following?.length
											? profileUser?.following?.length
											: 0}
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
										{profileUser?.followers?.length
											? profileUser?.followers?.length
											: 0}
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

					<TweetList tweets={tweets} />
				</Box>
			)}
			<EditProfileDialog open={open} onClose={handleClose} />
		</>
	);
};

export default Profile;
