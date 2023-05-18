import {
	Box,
	IconButton,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import noAvatar from "../../assets/images/noAvatar.png";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Tooltips from "./Items/Tooltips";
import tweetApi from "../../api/tweetApi";
import { Tweet } from "../../types/Tweet";
import TweetImageDialog from "./dialog/TweetImageDialog";
import { useTweetContext } from "../../contexts/TweetProvider";
import { useUserContext } from "../../contexts/UserProvider";

interface ITweetImage {
	imageCount: number;
}

const TweetImage = styled("img")<ITweetImage>(({ theme, imageCount }) => ({
	objectFit: "cover",
	// borderRadius: theme.shape.borderRadius,
	// marginTop: theme.spacing(1),
	// marginBottom: theme.spacing(1),
	// marginRight: theme.spacing(0.5),
	...getImageStyle(imageCount),
	"&:hover": {
		cursor: "pointer",
	},
}));

const getImageStyle = (imageCount: number) => {
	switch (imageCount) {
		case 1:
			return {
				width: "100%",
				height: "auto",
			};
		case 2:
		case 3:
		case 4:
			return {
				width: "calc(50% - 4px)",
				height: "auto",
			};
		default:
			return {};
	}
};

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

const TweetDetail = () => {
	const { user } = useUserContext();
	const { tweetId } = useParams();
	const navigate = useNavigate();
	const goBack = () => navigate(-1);

	const [tweet, setTweet] = useState<Tweet>();
	const [loading, setLoading] = useState<boolean>(false);
	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
	const [open, setOpen] = useState<boolean>(false);
	const [selectedTweetId, setSelectedTweetId] = useState<string>("");
	const [tweetUserId, setTweetUserId] = useState<string>("");
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [originalTweetId, setOriginalTweetId] = useState<string>("");
	const [retweetUserIds, setRetweetUserIds] = useState<string[]>([]);
	const [initialImageIndex, setInitialImageIndex] = useState<number>(0);

	useEffect(() => {
		const getTweet = async () => {
			setLoading(true);
			setTweet(undefined);
			try {
				const res = await tweetApi.getTweet(tweetId as string);
				console.log(res.data);
				console.log("ツイート詳細を取得しました");
				setTweet(res.data[0]);
				setLoading(false);
			} catch (err) {
				console.log(err);
				setLoading(false);
			}
		};

		getTweet();
	}, [tweetId]);

	const formatDate = (date: Date) => {
		const options = {
			hour: "2-digit",
			minute: "2-digit",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour12: true,
		} as const;

		const formattedDate = new Date(date).toLocaleString("en-US", options);

		const [datePart, timePart] = formattedDate.split(" at ");
		return `${timePart} · ${datePart}`;
	};

	const handleDialogOpen = (
		tweetId: string,
		userId: string,
		images: string[],
		originalTweetId: string,
		retweetUsers: string[],
		index: number
	) => {
		setOpen(true);
		setSelectedTweetId(tweetId);
		setTweetUserId(userId);
		setSelectedImages(images);
		setOriginalTweetId(originalTweetId);
		setRetweetUserIds(retweetUsers);
		setInitialImageIndex(index);
	};

	const handleDialogClose = () => {
		setOpen(false);
		setSelectedTweetId("");
		setTweetUserId("");
		setSelectedImages([]);
		setRetweetUserIds([]);
		setInitialImageIndex(0);
	};

	return (
		<>
			<Box
				sx={{
					margin: "10px 10px 0",
					maxWidth: 500,
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						position: "sticky",
						top: 0,
						zIndex: 11,
					}}
				>
					<IconButton onClick={goBack}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ ml: "10px" }}>
						<Typography sx={{ fontWeight: "bold" }}>Tweet</Typography>
					</Box>
				</Box>
			</Box>
			<Box>
				<Box
					sx={{ ml: "10px", display: "flex", justifyContent: "space-between" }}
				>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<IconButton
							component={Link}
							to={`/user/${
								tweet?.retweet && Object.keys(tweet.retweet).length !== 0
									? tweet.retweet.originalUser?.username.replace("@", "")
									: tweet?.user.username.replace("@", "")
							}`}
						>
							<Avatar
								alt={
									tweet?.retweet && Object.keys(tweet.retweet).length !== 0
										? tweet.retweet.originalUser?.profileName
										: tweet?.user.profileName
								}
								src={
									tweet?.retweet && Object.keys(tweet.retweet).length !== 0
										? IMAGE_URL + tweet.retweet.originalUser?.icon
										: IMAGE_URL + tweet?.user.icon
								}
							/>
						</IconButton>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								ml: "5px",
							}}
						>
							<Typography
								sx={{
									fontWeight: "bold",
									":hover": { textDecoration: "underline" },
								}}
								component="span"
								variant="body2"
								color="text.primary"
							>
								<Link
									to={`/user/${
										tweet?.retweet && Object.keys(tweet.retweet).length !== 0
											? tweet.retweet.originalUser?.username.replace("@", "")
											: tweet?.user.username.replace("@", "")
									}`}
									style={{ color: "black", textDecoration: "none" }}
								>
									{tweet?.retweet && Object.keys(tweet.retweet).length !== 0
										? tweet.retweet.originalUser?.profileName
										: tweet?.user.profileName}
								</Link>
							</Typography>
							<Typography
								component="span"
								variant="body2"
								sx={{
									color: "#898989",
								}}
							>
								<Link
									to={`/user/${
										tweet?.retweet && Object.keys(tweet.retweet).length !== 0
											? tweet.retweet.originalUser?.username.replace("@", "")
											: tweet?.user.username.replace("@", "")
									}`}
									style={{ color: "#898989", textDecoration: "none" }}
								>
									{tweet?.retweet && Object.keys(tweet.retweet).length !== 0
										? tweet.retweet.originalUser?.username
										: tweet?.user.username}
								</Link>
							</Typography>
						</Box>
					</Box>
					<Box>
						<IconButton>
							<MoreHorizIcon />
						</IconButton>
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					ml: "20px",
					mt: "10px",
					paddingBottom: "20px",
					textAlign: "left",
					borderBottom: "solid 1px #cacaca",
				}}
			>
				<Typography>{tweet?.content}</Typography>
				{tweet?.retweet && Object.keys(tweet?.retweet).length !== 0
					? tweet?.retweet.originalTweetImage.map((image, index) => (
							<TweetImage
								key={image + index}
								src={IMAGE_URL + image}
								alt={image}
								imageCount={tweet.retweet.originalTweetImage.length}
								onClick={() => {
									handleDialogOpen(
										tweet._id,
										tweet.userId,
										tweet.retweet.originalTweetImage,
										tweet.retweet.originalTweetId,
										tweet.retweetUsers,
										index
									);
								}}
							/>
					  ))
					: tweet?.tweetImage.map((image, index) => (
							<TweetImage
								key={image + index}
								src={IMAGE_URL + image}
								alt={image}
								imageCount={tweet.tweetImage.length}
								onClick={() => {
									handleDialogOpen(
										tweet._id,
										tweet.userId,
										tweet.tweetImage,
										tweet.retweet && Object.keys(tweet.retweet).length !== 0
											? tweet.retweet.originalTweetId
											: "",
										tweet.retweetUsers,
										index
									);
								}}
							/>
					  ))}
				<Typography
					variant="body1"
					mt={2}
					sx={{
						display: "flex",
						color: "#898989",
					}}
				>
					{formatDate(tweet?.updatedAt as Date)} ・
					<Typography
						variant="body1"
						mr={"5px"}
						ml={"5px"}
						sx={{ color: "black", fontWeight: "bold" }}
					>
						{tweet?.viewCount}
					</Typography>
					Views
				</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					padding: "20px 0",
					ml: "20px",
					borderBottom: "solid 1px #cacaca",
				}}
			>
				<Typography variant="body1" mr={1} sx={{ fontWeight: "bold" }}>
					{(tweet?.retweetUsers.length as number) > 0 &&
						tweet?.retweetUsers.length}
				</Typography>
				<Typography variant="body1" ml={"1px"} sx={{ color: "#898989" }}>
					{(tweet?.retweetUsers.length as number) > 0 && "Retweet"}
				</Typography>
				<Typography
					variant="body1"
					ml={"10px"}
					mr={1}
					sx={{ fontWeight: "bold" }}
				>
					17
				</Typography>
				<Typography variant="body1" ml={"1px"} sx={{ color: "#898989" }}>
					Likes
				</Typography>
			</Box>
			{tweet?.retweet && Object.keys(tweet.retweet).length !== 0 ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-around",
						padding: "10px 0",
						ml: "20px",
						borderBottom: "solid 1px #cacaca",
					}}
				>
					<Tooltips
						userId={tweet?.userId as string}
						tweetId={tweet?._id as string}
						originalTweetId={
							tweet?.retweet && Object.keys(tweet.retweet).length !== 0
								? tweet.retweet.originalTweetId
								: ""
						}
						fontSize="20px"
						color=""
						retweetUsers={tweet?.retweetUsers ? tweet.retweetUsers : []}
					/>
				</Box>
			) : (
				<></>
			)}
			<Box
				component="form"
				encType="multipart/form-data"
				noValidate
				sx={{
					display: "flex",
					ml: "20px",
					paddingBottom: "10px",
					maxWidth: 500,
					borderBottom: "solid 1px #cacaca",
				}}
			>
				<Link to={`/user/${user?.username}`}>
					<Avatar
						src={user?.icon ? IMAGE_URL + user?.icon : noAvatar}
						alt="noAvatar"
						sx={{ mt: "20px", mr: "10px" }}
					/>
				</Link>
				<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<TextField
							fullWidth
							variant="outlined"
							id="tweet"
							name="tweet"
							label="Tweet your reply!"
							placeholder="Tweet your reply!"
							margin="normal"
							multiline
							// onChange={(e) => setTweet(e.target.value)}
							// error={tweetErrMsg !== ""}
							// helperText={tweetErrMsg}
							inputProps={{ maxLength: 140 }}
							sx={{
								"& .MuiOutlinedInput-root": {
									"& fieldset": {
										border: "none",
									},
								},
							}}
							onChange={(e) => setIsInputEmpty(e.target.value === "")}
						/>
						{isInputEmpty && (
							<LoadingButton
								type="submit"
								disabled={true}
								sx={{
									height: "30px",
									padding: "5px 20px",
									borderRadius: "40px",
									textTransform: "none",
									background: "#1DA1F2",
									color: "#fff",
									"&.Mui-disabled": {
										opacity: 0.7,
										color: "#fff",
									},
									":hover": { background: "#1da0f29c" },
								}}
							>
								Reply
							</LoadingButton>
						)}
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex" }}>
							<IconButton
								component="label"
								htmlFor="tweetImage"
								// disabled={images.length === 4}
								sx={{
									color: "#1DA1F2",
									display: isInputEmpty ? "none" : "block",
									":hover": {
										cursor: "pointer",
										background: "#c2dff0",
										borderRadius: "50%",
									},
								}}
							>
								<input
									type="file"
									id="tweetImage"
									name="tweetImage"
									accept="video/mp4 image/png image/jpeg audio/mpeg"
									multiple
									style={{ display: "none" }}
									// onChange={handleImageChange}
								/>
								<ImageIcon />
							</IconButton>
							<IconButton
								sx={{
									color: "#1DA1F2",
									display: isInputEmpty ? "none" : "block",
									":hover": {
										cursor: "pointer",
										background: "#c2dff0",
										borderRadius: "50%",
									},
								}}
							>
								<EmojiEmotionsIcon />
							</IconButton>
						</Box>
						{isInputEmpty || (
							<LoadingButton
								type="submit"
								loading={loading}
								disabled={true}
								sx={{
									padding: "5px 20px",
									borderRadius: "40px",
									textTransform: "none",
									background: "#1DA1F2",
									color: "#fff",
									"&.Mui-disabled": {
										opacity: 0.7,
										color: "#fff",
									},
									":hover": { background: "#1da0f29c" },
								}}
							>
								Reply
							</LoadingButton>
						)}
					</Box>
				</Box>
			</Box>
			<Box>
				<List
					// key={tweet._id}
					sx={{
						width: "100%",
						bgcolor: "background.paper",
					}}
				>
					<ListItem
						alignItems="flex-start"
						sx={{ borderBottom: "solid 1px #cacaca" }}
					>
						<ListItemAvatar>
							<IconButton component={Link} to={`/user`}>
								<Avatar
									// alt={tweet.user.profileName}
									// src={IMAGE_URL + tweet.user.icon}
									src={noAvatar}
								/>
							</IconButton>
						</ListItemAvatar>
						<Box sx={{ flexGrow: 1, mt: "10px" }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Box sx={{ display: "flex" }}>
									<Typography
										sx={{
											fontWeight: "bold",
											":hover": { textDecoration: "underline" },
										}}
										component="span"
										variant="body2"
										color="text.primary"
									>
										<Link
											to={`/user/`}
											style={{
												color: "black",
												textDecoration: "none",
												fontWeight: "bold",
											}}
										>
											username
										</Link>
									</Typography>
									<Typography
										component="span"
										variant="body2"
										ml={"5px"}
										sx={{
											color: "#898989",
										}}
									>
										ユーザー名・5h
									</Typography>
								</Box>
								<Box>
									<IconButton>
										<MoreHorizIcon />
									</IconButton>
								</Box>
							</Box>
							<Link
								to={`/tweet/`}
								style={{
									color: "black",
									textDecoration: "none",
								}}
							>
								<Typography>ツイート</Typography>
								{/* {tweet.tweetImage.map((image, index) => (
										<TweetImage
											key={image + index}
											src={IMAGE_URL + image}
											alt={image}
											imageCount={tweet.tweetImage.length}
											onClick={() => {
												handleDialogOpen(tweet.tweetImage, index);
											}}
										/>
									))} */}
							</Link>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									padding: "10px 0",
								}}
							>
								{/* <Tooltips
									tweetId={tweetId as string}
									fontSize="20px"
									color=""
								/> */}
							</Box>
						</Box>
					</ListItem>
				</List>
			</Box>
			<TweetImageDialog
				open={open}
				onClose={handleDialogClose}
				images={selectedImages}
				initialImageIndex={initialImageIndex}
				tweetId={selectedTweetId}
				userId={tweetUserId}
				retweetUsers={retweetUserIds}
				originalTweetId={originalTweetId}
			/>
		</>
	);
};

export default TweetDetail;
