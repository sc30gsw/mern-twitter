import {
	Box,
	IconButton,
	TextField,
	Typography,
	CircularProgress,
	Dialog,
	DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import noAvatar from "../../../assets/images/noAvatar.png";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Tweet } from "../../../types/Tweet";
import commentApi from "../../../api/commentApi";
import { useUserContext } from "../../../contexts/UserProvider";
import tweetApi from "../../../api/tweetApi";
import { useCommentDialogContext } from "../../../contexts/TweetBoxDialogProvider";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

type CommentDialogProps = {
	tweetId: string;
	open: boolean;
	onClose: () => void;
};

const CommentDialog = ({ tweetId, open, onClose }: CommentDialogProps) => {
	const { user } = useUserContext();
	const { setCommentOpenDialog } = useCommentDialogContext();
	const [tweet, setTweet] = useState<Tweet>();
	const [loading, setLoading] = useState<boolean>(false);
	const [tweetLoading, setTweetLoading] = useState<boolean>(true);
	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
	const [focus, setFocus] = useState<boolean>(false);
	const [charCount, setCharCount] = useState<number>(0);
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [comment, setComment] = useState<string>("");
	const [commentErrMsg, setCommentErrMsg] = useState<string>("");

	useEffect(() => {
		const getTweet = async () => {
			setTweet(undefined);
			try {
				const res = await tweetApi.getTweet(tweetId as string);
				console.log("ツイート詳細を取得しました");
				setTweet(res.data[0]);
				setTweetLoading(false);
			} catch (err) {
				console.log(err);
				setTweetLoading(false);
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
			setCommentOpenDialog(false);
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
		}
	};
	return (
		<>
			{tweetLoading || (
				<Dialog
					open={open}
					onClose={onClose}
					aria-labelledby="tweet-box-dialog"
					sx={{
						"& .MuiDialog-paper": {
							width: "70%",
							height: "40%",
							position: "absolute",
							top: 10,
							borderRadius: "30px",
							minWidth: 400,
						},
					}}
				>
					<IconButton
						onClick={onClose}
						sx={{
							position: "absolute",
							top: 8,
							right: 8,
							color: "#1DA1F2",
							":hover": {
								cursor: "pointer",
								background: "#c2dff0",
								borderRadius: "50%",
							},
						}}
					>
						<CloseIcon />
					</IconButton>
					<DialogContent>
						<Box>
							<Box
								sx={{
									ml: "10px",
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<Box sx={{ display: "flex", alignItems: "center" }}>
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
											{tweet?.retweet && Object.keys(tweet.retweet).length !== 0
												? tweet.retweet.originalUser?.profileName
												: tweet?.user.profileName}
										</Typography>
										<Typography
											component="span"
											variant="body2"
											sx={{
												color: "#898989",
											}}
										>
											{tweet?.retweet && Object.keys(tweet.retweet).length !== 0
												? tweet.retweet.originalUser?.username
												: tweet?.user.username}
										</Typography>
									</Box>
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
							</Typography>
						</Box>
						{focus && (
							<Box sx={{ display: "flex", ml: 10, mt: 2, color: "#898989" }}>
								Replying to
								{tweet?.retweet && Object.keys(tweet.retweet).length !== 0
									? tweet.retweet.originalUser?.username
									: tweet?.user.username}
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
							<Avatar
								src={user?.icon ? IMAGE_URL + user?.icon : noAvatar}
								alt="noAvatar"
								sx={{ mt: "20px", mr: "10px" }}
							/>

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
									sx={{
										display: "flex",
										flexWrap: "wrap",
										position: "relative",
									}}
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
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};

export default CommentDialog;
