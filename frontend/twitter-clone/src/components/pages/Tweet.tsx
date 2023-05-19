import {
	Box,
	IconButton,
	List,
	ListItem,
	TextField,
	Typography,
	CircularProgress,
} from "@mui/material";
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
	const [comment, setComment] = useState<string>("");
	const [commentErrMsg, setCommentErrMsg] = useState<string>("");

	useEffect(() => {
		const getTweet = async () => {
			setLoading(true);
			setTweet(undefined);
			try {
				const res = await tweetApi.getTweet(tweetId as string);
				console.log("ツイート詳細を取得しました");
				const viewCount = await tweetApi.getViewCount(tweetId as string);
				setViewCount(viewCount.data.viewCount);
				setTweet(res.data[0]);
				setLoading(false);
			} catch (err) {
				console.log(err);
				setLoading(false);
			}
		};

		getTweet();
	}, [tweetId]);

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
		formData.append("tweetId", tweetId as string);
		formData.append("content", comment);
		images.forEach((image) => {
			formData.append("commentImage", image);
		});

		// コメント登録API呼出
		try {
			const res = await commentApi.create(formData);
			console.log(res.data);

			console.log("コメント登録に成功しました");
			setLoading(false);
			setImagePreviews([]);
			setImages([]);
			setComment("");
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
		}
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
					/>
				</Box>
			) : (
				<></>
			)}
			{focus && (
				<Box sx={{ display: "flex", ml: 10, mt: 2, color: "#898989" }}>
					Replying to{" "}
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
							id="tweet"
							name="tweet"
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
					<Box sx={{ display: "flex", flexWrap: "wrap", position: "relative" }}>
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
