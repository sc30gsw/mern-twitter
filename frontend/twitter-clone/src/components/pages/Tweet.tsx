import {
	Box,
	IconButton,
	List,
	ListItem,
	TextField,
	Typography,
	CircularProgress,
	Menu,
	ListItemIcon,
	MenuItem,
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
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
import { useUserContext } from "../../contexts/UserProvider";
import commentApi from "../../api/commentApi";
import { Comment } from "../../types/Comment";
import { useCommentDialogContext } from "../../contexts/TweetBoxDialogProvider";
import CommentDialog from "./dialog/CommentDialog";
import DeleteTweetDialog from "./dialog/DelteDialog";

interface ITweetImage {
	imageCount: number;
}

const TweetImage = styled("img")<ITweetImage>(({ theme, imageCount }) => ({
	objectFit: "cover",
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
	const { commentOpenDialog, setCommentOpenDialog } = useCommentDialogContext();
	const { tweetId } = useParams();
	const navigate = useNavigate();
	const goBack = () => navigate(-1);

	const [tweet, setTweet] = useState<Tweet>();
	const [viewCount, setViewCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
	const [focus, setFocus] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [selectedTweetId, setSelectedTweetId] = useState<string>("");
	const [tweetUserId, setTweetUserId] = useState<string>("");
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [originalTweetId, setOriginalTweetId] = useState<string>("");
	const [retweetUserIds, setRetweetUserIds] = useState<string[]>([]);
	const [initialImageIndex, setInitialImageIndex] = useState<number>(0);
	const [charCount, setCharCount] = useState<number>(0);
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [comments, setComments] = useState<Comment[]>([]);
	const [comment, setComment] = useState<string>("");
	const [commentErrMsg, setCommentErrMsg] = useState<string>("");
	const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
	const [isCommentDelete, setIsCommentDelete] = useState<boolean>(false);
	const [commentId, setCommentId] = useState<string>("");

	useEffect(() => {
		const getTweetAndComments = async () => {
			setTweet(undefined);
			try {
				const res = await tweetApi.getTweet(tweetId as string);
				console.log("ツイート詳細を取得しました");
				const viewCount = await tweetApi.getViewCount(tweetId as string);
				setViewCount(viewCount.data.viewCount);
				setTweet(res.data[0]);

				const commentResponse = await commentApi.getComments(
					res.data[0].retweet.originalTweetId
						? res.data[0].retweet.originalTweetId
						: res.data[0]._id
				);

				console.log("コメント一覧を取得しました");
				setComments(commentResponse.data);
			} catch (err) {
				console.log(err);
			}
		};

		getTweetAndComments();
	}, [tweetId, setComments, commentOpenDialog]);

	const currentTime = new Date();
	const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);

	const progress = (charCount / 140) * 100;
	const remainingChars = 140 - charCount;

	const getColor = (charCount: number) => {
		if (charCount >= 140) {
			return "red";
		} else if (charCount >= 120) {
			return "#ffc760";
		} else {
			return "primary";
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			setImages([...images, ...filesArray]);

			const filePreviews = filesArray.map((file) => URL.createObjectURL(file));
			setImagePreviews([...imagePreviews, ...filePreviews]);
		}
	};

	const handleImageRemove = (imagePreview: string) => {
		// 引数と同じimagePreviewsのindexを取得
		const imageIndex = imagePreviews.indexOf(imagePreview);

		// imagePreviewが存在する場合
		if (imageIndex > -1) {
			const updatedImagePreviews = [...imagePreviews];
			// imagePreviewsから該当のimagePreviewを削除
			updatedImagePreviews.splice(imageIndex, 1);
			setImagePreviews(updatedImagePreviews);

			const updatedImages = [...images];
			// imagesから該当のimageを削除
			updatedImages.splice(imageIndex, 1);
			setImages(updatedImages);
		}
	};

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

	const formatCommentDate = (updatedAt: Date) => {
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		// バリデーション
		let err = false;

		// 改行と空白を除去した文字列を作成
		const trimmedComment = comment.replace(/(\r\n|\n|\r|\s)/g, "");

		if (!trimmedComment) {
			err = true;
			setCommentErrMsg("コメントを入力してください");
		} else if (comment.length > 140) {
			err = true;
			setCommentErrMsg("コメントは140文字以内で入力してください");
		}

		if (images.length > 4) {
			err = true;
			setCommentErrMsg("画像は4枚まで選択可能です");
		}

		if (err) return setLoading(false);
		const formData = new FormData();
		const commentTweetId =
			tweet?.retweet && Object.keys(tweet.retweet).length !== 0
				? tweet.retweet.originalTweetId
				: tweetId;
		formData.append("tweetId", commentTweetId as string);
		formData.append("content", comment);
		images.forEach((image) => {
			formData.append("commentImage", image);
		});

		// コメント登録API呼出
		try {
			await commentApi.create(formData);

			console.log("コメント登録に成功しました");
			setLoading(false);
			setImagePreviews([]);
			setImages([]);
			setComment("");
			const res = await commentApi.getComments(
				tweet?.retweet.originalTweetId
					? tweet.retweet.originalTweetId
					: (tweet?._id as string)
			);

			console.log("コメント一覧を取得しました");
			setComments(res.data);
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
		}
	};

	const handleCommentDelete = async (commentId: string) => {
		try {
			await commentApi.delete(commentId);
			console.log("コメント削除に成功しました");

			const res = await commentApi.getComments(
				tweet?.retweet.originalTweetId
					? tweet.retweet.originalTweetId
					: (tweet?._id as string)
			);

			console.log("コメント一覧を取得しました");
			setComments(res.data);
			setDeleteOpen(false);
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
		}
	};

	const handleCommentOpen = (tweetId: string) => {
		setSelectedTweetId(tweetId);
		setCommentOpenDialog(true);
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
						{tweet?.userId === user?._id &&
							!tweet?.retweetUsers.includes(user?._id as string) && (
								<PopupState variant="popover" popupId="demo-popup-menu">
									{(popupState) => (
										<>
											<IconButton {...bindTrigger(popupState)}>
												<MoreHorizIcon />
											</IconButton>
											<Menu {...bindMenu(popupState)}>
												{tweet?.userId === user?._id &&
												!tweet?.retweetUsers.includes(user?._id as string) ? (
													<MenuItem onClick={popupState.close}>
														<ListItemIcon>
															<DeleteOutlineOutlinedIcon
																sx={{ color: "red" }}
															/>
														</ListItemIcon>
														<Typography variant="inherit" sx={{ color: "red" }}>
															Delete
														</Typography>
													</MenuItem>
												) : (
													<Box></Box>
												)}
												{(tweet?.updatedCount as number) >= 5 ||
												new Date(tweet?.createdAt as Date).getTime() <
													thirtyMinutesAgo.getTime() ? (
													<Box></Box>
												) : tweet?.userId === user?._id &&
												  !tweet?.retweetUsers.includes(user?._id as string) ? (
													<MenuItem
														component={Link}
														to={`/editTweet/${tweet?._id}`}
													>
														<ListItemIcon>
															<ModeEditOutlineOutlinedIcon />
														</ListItemIcon>
														<Typography variant="inherit">Edit</Typography>
													</MenuItem>
												) : (
													<Box></Box>
												)}
											</Menu>
										</>
									)}
								</PopupState>
							)}
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
					{tweet?.retweet && Object.keys(tweet.retweet).length !== 0
						? formatDate(tweet.retweet.originalUpdatedAt)
						: formatDate(tweet?.updatedAt as Date)}
					・
					<Typography
						variant="body1"
						mr={"5px"}
						ml={"5px"}
						sx={{ color: "black", fontWeight: "bold" }}
					>
						{viewCount > 0 && viewCount}
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
						handleCommentOpen={() => setCommentOpenDialog(true)}
					/>
				</Box>
			) : (
				<></>
			)}
			{focus && (
				<Box sx={{ display: "flex", ml: 10, mt: 2, color: "#898989" }}>
					Replying to
					<Link
						to={`/user/${
							tweet?.retweet && Object.keys(tweet.retweet).length !== 0
								? tweet.retweet.originalUser?.username.replace("@", "")
								: tweet?.user.username.replace("@", "")
						}`}
						style={{ color: "#1DA1F2", marginLeft: 3, textDecoration: "none" }}
					>
						{tweet?.retweet && Object.keys(tweet.retweet).length !== 0
							? tweet.retweet.originalUser?.username
							: tweet?.user.username}
					</Link>
				</Box>
			)}
			{commentOpenDialog || (
				<Box
					component="form"
					encType="multipart/form-data"
					noValidate
					sx={{
						width: "100%",
						display: "flex",
						ml: "20px",
						paddingBottom: "10px",
						borderBottom: "solid 1px #cacaca",
					}}
					onSubmit={handleSubmit}
				>
					<Link to={`/user/${user?.username}`}>
						<Avatar
							src={user?.icon ? IMAGE_URL + user?.icon : noAvatar}
							alt="noAvatar"
							sx={{ mt: "20px", mr: "10px" }}
						/>
					</Link>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							flexGrow: 1,
							position: "relative",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<TextField
								fullWidth
								variant="outlined"
								id="comment"
								name="comment"
								value={comment}
								label="Tweet your reply!"
								placeholder="Tweet your reply!"
								margin="normal"
								multiline
								onChange={(e) => {
									setComment(e.target.value);
									setIsInputEmpty(e.target.value === "");
									setCharCount(e.target.value.length);
								}}
								error={commentErrMsg !== ""}
								helperText={commentErrMsg}
								inputProps={{ maxLength: 140 }}
								sx={{
									"& .MuiOutlinedInput-root": {
										"& fieldset": {
											border: "none",
										},
									},
								}}
								onFocus={() => setFocus(true)}
							/>
							{!focus && (
								<LoadingButton
									type="submit"
									disabled
									sx={{
										height: "30px",
										mr: 5,
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
						{/* 画像プレビュー */}
						<Box
							sx={{ display: "flex", flexWrap: "wrap", position: "relative" }}
						>
							{imagePreviews.map((imagePreview, index) => (
								<Box
									key={index}
									sx={{
										position: "relative",
										width: "100px",
										height: "100px",
										margin: "5px",
									}}
								>
									<IconButton
										sx={{
											position: "absolute",
											left: -10,
											top: -5,
											background: "#6f7070",
											color: "white",
											":hover": {
												background: "#6f7070",
												opacity: 0.7,
											},
										}}
										onClick={() => handleImageRemove(imagePreview)}
									>
										<CloseIcon />
									</IconButton>
									<img
										src={imagePreview}
										alt={`tweet_image_${index}`}
										width="100"
										height="100"
										style={{ objectFit: "cover" }}
									/>
								</Box>
							))}
						</Box>
						<Box
							sx={{
								display: !focus ? "none" : "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Box
								sx={{
									display: "flex",
								}}
							>
								<IconButton
									component="label"
									htmlFor="commentImage"
									disabled={images.length === 4}
									sx={{
										color: "#1DA1F2",
										":hover": {
											cursor: "pointer",
											background: "#c2dff0",
											borderRadius: "50%",
										},
									}}
								>
									<input
										type="file"
										id="commentImage"
										name="commentImage"
										accept="video/mp4 image/png image/jpeg audio/mpeg"
										multiple
										style={{ display: "none" }}
										onChange={handleImageChange}
									/>
									<ImageIcon />
								</IconButton>
								<IconButton
									sx={{
										color: "#1DA1F2",
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
							<Box>
								<Box
									sx={{
										mt: 1,
										mb: 2,
										mr: 2,
										position: "relative",
										display: "inline-flex",
									}}
								>
									<CircularProgress
										key={getColor(charCount)}
										variant="determinate"
										value={progress}
										style={{
											color: getColor(charCount),
										}}
									/>
									{remainingChars <= 20 && (
										<Box
											sx={{
												top: 0,
												left: 0,
												bottom: 0,
												right: 0,
												position: "absolute",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Typography
												variant="caption"
												component="div"
												color="text.secondary"
											>
												{remainingChars}
											</Typography>
										</Box>
									)}
								</Box>
								{focus && (
									<LoadingButton
										type="submit"
										loading={loading}
										disabled={isInputEmpty}
										sx={{
											mr: 5,
											mb: 4,
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
				</Box>
			)}
			<Box>
				{comments.map((comment) => (
					<List
						key={comment._id}
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
								<IconButton
									component={Link}
									to={`/user/${comment.user.username.replace("@", "")}`}
								>
									<Avatar
										alt={comment.user.profileName}
										src={IMAGE_URL + comment.user.icon}
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
												to={`/user/${comment.user.username.replace("@", "")}`}
												style={{
													color: "black",
													textDecoration: "none",
													fontWeight: "bold",
												}}
											>
												{comment.user.profileName}
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
											{comment.user.username}・
											{formatCommentDate(comment.updatedAt)}
										</Typography>
									</Box>
									<Box>
										{user?._id === comment.user._id && (
											<PopupState variant="popover" popupId="demo-popup-menu">
												{(popupState) => (
													<>
														<IconButton {...bindTrigger(popupState)}>
															<MoreHorizIcon />
														</IconButton>
														<Menu {...bindMenu(popupState)}>
															<MenuItem
																onClick={() => {
																	popupState.close();
																	setIsCommentDelete(true);
																	setDeleteOpen(true);
																	setCommentId(comment._id);
																}}
															>
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
														</Menu>
													</>
												)}
											</PopupState>
										)}
									</Box>
								</Box>
								<Link
									to={"#"}
									style={{
										color: "black",
										textDecoration: "none",
									}}
								>
									<Typography>{comment.content}</Typography>
									{comment.commentImage.map((image, index) => (
										<TweetImage
											key={image + index}
											src={IMAGE_URL + image}
											alt={image}
											imageCount={comment.commentImage.length}
											onClick={() => {
												handleDialogOpen(
													comment.tweetId,
													comment.userId,
													comment.commentImage,
													tweet?.retweet &&
														Object.keys(tweet?.retweet).length !== 0
														? tweet.retweet.originalTweetId
														: "",
													tweet?.retweetUsers as string[],
													index
												);
											}}
										/>
									))}
								</Link>
							</Box>
						</ListItem>
					</List>
				))}
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
				handleCommentOpen={handleCommentOpen}
			/>
			<CommentDialog
				tweetId={tweetId as string}
				open={commentOpenDialog}
				onClose={() => setCommentOpenDialog(false)}
			/>
			<DeleteTweetDialog
				title={isCommentDelete ? "Comment" : "Tweet"}
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				deleteId={isCommentDelete ? commentId : ""}
				handleDelete={isCommentDelete ? handleCommentDelete : () => {}}
			/>
		</>
	);
};

export default TweetDetail;
