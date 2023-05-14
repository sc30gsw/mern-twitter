import { Box, Typography, List, IconButton } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tweet } from "../../types/Tweet";
import { styled } from "@mui/system";
import tweetApi from "../../api/tweetApi";
import { useTweetContext } from "../../contexts/TweetProvider";
import Tooltips from "./Items/Tooltips";
import { useState } from "react";
import TweetImageDialog from "./dialog/TweetImageDialog";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

interface ITweetImage {
	imageCount: number;
}

const TweetImage = styled("img")<ITweetImage>(({ theme, imageCount }) => ({
	objectFit: "cover",
	borderRadius: theme.shape.borderRadius,
	marginTop: theme.spacing(1),
	marginBottom: theme.spacing(1),
	marginRight: theme.spacing(0.5),
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

type TweetListProps = {
	tweets: Tweet[];
};

const TweetList = ({ tweets }: TweetListProps) => {
	const { setTweets } = useTweetContext();
	const [open, setOpen] = useState<boolean>(false);
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [initialImageIndex, setInitialImageIndex] = useState<number>(0);

	const formatDate = (updatedAt: Date) => {
		const now = new Date();
		const tweetDate = new Date(updatedAt);
		const diffInSeconds = Math.floor(
			(now.getTime() - tweetDate.getTime()) / 1000
		);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInDays >= 1) {
			return `${tweetDate.toLocaleString("en", {
				month: "short",
			})}.${tweetDate.getDate()}`;
		} else if (diffInHours >= 1) {
			return `${diffInHours}h`;
		} else if (diffInMinutes >= 1) {
			return `${diffInMinutes}m`;
		} else {
			return `${diffInSeconds}s`;
		}
	};

	const handleRefresh = async () => {
		const res = await tweetApi.search();
		setTweets(res.data);
	};

	const handleDialogOpen = (images: string[], index: number) => {
		setOpen(true);
		setSelectedImages(images);
		setInitialImageIndex(index);
	};

	const handleDialogClose = () => {
		setOpen(false);
		setSelectedImages([]);
		setInitialImageIndex(0);
	};

	return (
		<>
			<Box sx={{ borderTop: "solid 1px #657786" }}>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<IconButton onClick={handleRefresh}>
						<RefreshIcon />
					</IconButton>
				</Box>
				{tweets.length > 0 &&
					tweets.map((tweet) => (
						<List
							key={tweet._id}
							sx={{
								width: "100%",
								bgcolor: "background.paper",
								borderBottom: "solid 1px #cacaca",
							}}
						>
							<ListItem alignItems="flex-start">
								<ListItemAvatar>
									<IconButton
										component={Link}
										to={`/user/${tweet.user.username.split("@").join("")}`}
									>
										<Avatar
											alt={tweet.user.profileName}
											src={IMAGE_URL + tweet.user.icon}
										/>
									</IconButton>
								</ListItemAvatar>
								<Box sx={{ flexGrow: 1, mt: "20px" }}>
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
													to={`/user/${tweet.user.username
														.split("@")
														.join("")}`}
													style={{ color: "black", textDecoration: "none" }}
												>
													{tweet.user.profileName}
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
												{tweet.user.username}・{formatDate(tweet.updatedAt)}
											</Typography>
										</Box>
										<Box>
											<IconButton>
												<MoreHorizIcon />
											</IconButton>
										</Box>
									</Box>
									<Link
										to={`/tweet/${tweet._id}`}
										style={{ color: "black", textDecoration: "none" }}
									>
										<Typography
											sx={{
												overflowWrap: "break-word",
												wordBreak: "break-all",
											}}
										>
											{tweet.content}
										</Typography>
									</Link>
									{tweet.tweetImage.map((image, index) => (
										<TweetImage
											key={image + index}
											src={IMAGE_URL + image}
											alt={image}
											imageCount={tweet.tweetImage.length}
											onClick={() => {
												handleDialogOpen(tweet.tweetImage, index);
											}}
										/>
									))}
								</Box>
							</ListItem>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-evenly",
								}}
							>
								<Tooltips fontSize="20px" color="" />
							</Box>
						</List>
					))}
			</Box>
			<TweetImageDialog
				open={open}
				onClose={handleDialogClose}
				images={selectedImages}
				initialImageIndex={initialImageIndex}
			/>
		</>
	);
};

export default TweetList;
