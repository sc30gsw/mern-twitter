import {
	Box,
	Typography,
	List,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Tweet } from "../../types/Tweet";
import { styled } from "@mui/system";
import tweetApi from "../../api/tweetApi";
import { useTweetContext } from "../../contexts/TweetProvider";
import Tooltips from "./Items/Tooltips";
import { useState } from "react";
import TweetImageDialog from "./dialog/TweetImageDialog";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import { useUserContext } from "../../contexts/UserProvider";

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
	const { user } = useUserContext();
	const { setTweets } = useTweetContext();
	const [open, setOpen] = useState<boolean>(false);
	const [selectedTweetId, setSelectedTweetId] = useState<string>("");
	const [tweetUserId, setTweetUserId] = useState<string>("");
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [originalTweetId, setOriginalTweetId] = useState<string>("");
	const [retweetUserIds, setRetweetUserIds] = useState<string[]>([]);
	const [initialImageIndex, setInitialImageIndex] = useState<number>(0);

	const currentTime = new Date();
	const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);

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
								{Object.keys(tweet.retweet).length !== 0 &&
								tweet.userId === user?._id ? (
									<Box sx={{ display: "flex", position: "absolute", left: 60 }}>
										<RepeatOutlinedIcon
											sx={{
												color: "#898989",
												fontSize: "20px",
												mr: 1,
											}}
										/>
										<Typography
											sx={{
												fontWeight: "bold",
												fontSize: "13px",
												":hover": { textDecoration: "underline" },
											}}
											component="span"
											color="text.primary"
										>
											<Link
												to={`/user/${tweet.user?.username.replace("@", "")}`}
												style={{ color: "#898989", textDecoration: "none" }}
											>
												You Retweeted
											</Link>
										</Typography>
									</Box>
								) : Object.keys(tweet.retweet).length !== 0 ? (
									<Box sx={{ display: "flex", position: "absolute", left: 60 }}>
										<RepeatOutlinedIcon
											sx={{
												color: "#898989",
												fontSize: "20px",
												mr: 1,
											}}
										/>
										<Typography
											sx={{
												fontWeight: "bold",
												fontSize: "13px",
												":hover": { textDecoration: "underline" },
											}}
											component="span"
											color="text.primary"
										>
											<Link
												to={`/user/${tweet.user?.username.replace("@", "")}`}
												style={{ color: "#898989", textDecoration: "none" }}
											>
												{tweet.user?.username} Retweeted
											</Link>
										</Typography>
									</Box>
								) : (
									<></>
								)}
								<ListItemAvatar>
									<IconButton
										component={Link}
										to={`/user/${
											tweet.retweet && Object.keys(tweet.retweet).length !== 0
												? tweet.retweet.originalUser?.username.replace("@", "")
												: tweet.user?.username.replace("@", "")
										}`}
									>
										<Avatar
											alt={
												tweet.retweet && Object.keys(tweet.retweet).length !== 0
													? tweet.retweet.originalUser?.profileName
													: tweet.user?.profileName
											}
											src={
												tweet.retweet && Object.keys(tweet.retweet).length !== 0
													? IMAGE_URL + tweet.retweet.originalUser?.icon
													: IMAGE_URL + tweet.user?.icon
											}
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
													to={`/user/${
														tweet.retweet &&
														Object.keys(tweet.retweet).length !== 0
															? tweet.retweet.originalUser?.username.replace(
																	"@",
																	""
															  )
															: tweet.user?.username.replace("@", "")
													}`}
													style={{ color: "black", textDecoration: "none" }}
												>
													{tweet.retweet &&
													Object.keys(tweet.retweet).length !== 0
														? tweet.retweet.originalUser?.profileName
														: tweet.user?.profileName}
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
												{tweet.retweet &&
												Object.keys(tweet.retweet).length !== 0
													? tweet.retweet.originalUser?.username
													: tweet.user?.username}
												・
												{tweet.retweet &&
												Object.keys(tweet.retweet).length !== 0
													? formatDate(tweet.retweet.originalUpdatedAt)
													: formatDate(tweet.updatedAt)}
											</Typography>
										</Box>
										<Box>
											<PopupState variant="popover" popupId="demo-popup-menu">
												{(popupState) => (
													<>
														<IconButton {...bindTrigger(popupState)}>
															<MoreHorizIcon />
														</IconButton>
														<Menu {...bindMenu(popupState)}>
															{tweet.userId === user?._id &&
															!tweet.retweetUsers.includes(user?._id) ? (
																<MenuItem onClick={popupState.close}>
																	<ListItemIcon>
																		<DeleteOutlineOutlinedIcon
																			sx={{ color: "red" }}
																		/>
																	</ListItemIcon>
																	<Typography
																		variant="inherit"
																		sx={{ color: "red" }}
																	>
																		Delete
																	</Typography>
																</MenuItem>
															) : (
																<Box></Box>
															)}
															{tweet.updatedCount >= 5 ||
															new Date(tweet.createdAt).getTime() <
																thirtyMinutesAgo.getTime() ? (
																<Box></Box>
															) : tweet.userId === user?._id &&
															  !tweet.retweetUsers.includes(user?._id) ? (
																<MenuItem
																	component={Link}
																	to={`/editTweet/${tweet._id}`}
																>
																	<ListItemIcon>
																		<ModeEditOutlineOutlinedIcon />
																	</ListItemIcon>
																	<Typography variant="inherit">
																		Edit
																	</Typography>
																</MenuItem>
															) : (
																<Box></Box>
															)}
															<MenuItem
																component={Link}
																to={`/tweet/${tweet._id}`}
															>
																<ListItemIcon>
																	<InfoOutlinedIcon />
																</ListItemIcon>
																<Typography variant="inherit">
																	Detail
																</Typography>
															</MenuItem>
														</Menu>
													</>
												)}
											</PopupState>
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
									{tweet.retweet && Object.keys(tweet.retweet).length !== 0
										? tweet.retweet.originalTweetImage.map((image, index) => (
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
										: tweet.tweetImage.map((image, index) => (
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
															tweet.retweet &&
																Object.keys(tweet.retweet).length !== 0
																? tweet.retweet.originalTweetId
																: "",
															tweet.retweetUsers,
															index
														);
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
								<Tooltips
									userId={tweet.userId}
									tweetId={tweet._id}
									originalTweetId={
										tweet.retweet && Object.keys(tweet.retweet).length !== 0
											? tweet.retweet.originalTweetId
											: ""
									}
									fontSize="20px"
									color=""
									retweetUsers={tweet.retweetUsers ? tweet.retweetUsers : []}
								/>
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
						</List>
					))}
			</Box>
		</>
	);
};

export default TweetList;
