import {
	Typography,
	Box,
	TextField,
	Avatar,
	IconButton,
	CircularProgress,
	Dialog,
	DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import noAvatar from "../../../assets/images/noAvatar.png";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import tweetApi from "../../../api/tweetApi";
import { useUserContext } from "../../../contexts/UserProvider";
import { useTweetContext } from "../../../contexts/TweetProvider";
import { Link, useNavigate } from "react-router-dom";
import { Tweet } from "../../../types/Tweet";
import { useEditTweetBoxDialogContext } from "../../../contexts/TweetBoxDialogProvider";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

type EditTweetBoxDialogProps = {
	open: boolean;
	tweet: Tweet;
};

const EditTweetBoxDialog = ({ open, tweet }: EditTweetBoxDialogProps) => {
	const { setEditOpenDialog } = useEditTweetBoxDialogContext();
	const navigate = useNavigate();
	const goBack = () => {
		setEditOpenDialog(false);
		navigate(-1);
	};

	const { user } = useUserContext();
	const { setTweets } = useTweetContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [content, setContent] = useState<string>(tweet.content);
	const [contentErrMsg, setContentErrMsg] = useState<string>("");
	const [charCount, setCharCount] = useState<number>(tweet.content.length);
	const [tweetImage, setTweetImage] = useState<string[]>(
		tweet.tweetImage.length > 0 ? tweet.tweetImage : []
	);
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	const handleRemoveTweetImage = (image: string) => {
		const filterTweetImage = tweetImage.filter((_image) => _image !== image);
		setTweetImage(filterTweetImage);
	};

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
		if (tweetImage.length !== 0) {
			alert("既存の画像を全て削除してから画像を選択してください");
			return;
		}
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		// バリデーション
		let err = false;

		// 改行と空白を除去した文字列を作成
		const trimmedTweet = content.replace(/(\r\n|\n|\r|\s)/g, "");

		if (!trimmedTweet) {
			err = true;
			setContentErrMsg("ツイートを入力してください");
		} else if (content.length > 140) {
			err = true;
			setContentErrMsg("ツイートは140文字以内で入力してください");
		}

		if (images.length > 4) {
			err = true;
			setContentErrMsg("画像は4枚まで選択可能です");
		}

		if (err) return setLoading(false);
		const formData = new FormData();
		formData.append("content", content);
		if (tweetImage.length === 0) {
			console.log(tweetImage.length);
			images.forEach((image) => {
				formData.append("tweetImage", image);
			});
		}

		// ツイート更新API呼出
		try {
			await tweetApi.update(tweet._id, formData);

			console.log("ツイート更新に成功しました");
			setLoading(false);
			setImagePreviews([]);
			setImages([]);
			setContent("");
			goBack();

			const res = await tweetApi.search();
			setTweets(res.data);
		} catch (err: any) {
			const errors = err.data.errors;
			alert(errors[0].msg);
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={goBack}
			aria-labelledby="tweet-box-dialog"
			sx={{
				"& .MuiDialog-paper": {
					width: "70%",
					height: "40%",
					position: "absolute",
					top: 10,
					borderRadius: "30px",
					minWidth: 310,
				},
			}}
		>
			<IconButton
				onClick={goBack}
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
						component="form"
						encType="multipart/form-data"
						noValidate
						onSubmit={handleSubmit}
						sx={{ display: "flex", mr: "10px", maxWidth: 500 }}
					>
						<Link to={`user/${user?.username.split("@").join("")}`}>
							<Avatar
								src={user?.icon ? IMAGE_URL + user?.icon : noAvatar}
								alt="noAvatar"
								sx={{ mt: "30px", mr: "10px" }}
							/>
						</Link>
						<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
							<TextField
								fullWidth
								variant="standard"
								id="content"
								name="content"
								value={content}
								rows={4}
								label="What's happening?"
								placeholder="What's happening?"
								margin="normal"
								multiline
								onChange={(e) => {
									setContent(e.target.value);
									setCharCount(e.target.value.length);
								}}
								error={contentErrMsg !== ""}
								helperText={contentErrMsg}
								inputProps={{ maxLength: 140 }}
							/>
							{/* 画像プレビュー */}
							<Box
								sx={{ display: "flex", flexWrap: "wrap", position: "relative" }}
							>
								{tweetImage.length === 0
									? imagePreviews.map((imagePreview, index) => (
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
									  ))
									: tweetImage.map((image, index) => (
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
													onClick={() => handleRemoveTweetImage(image)}
												>
													<CloseIcon />
												</IconButton>
												<img
													src={IMAGE_URL + image}
													alt={`tweet_image_${index}`}
													width="100"
													height="100"
												/>
											</Box>
									  ))}
							</Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Box
									sx={{
										width: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box>
										<IconButton
											component="label"
											htmlFor="tweetImage"
											disabled={images.length === 4 || tweetImage.length === 4}
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
												id="tweetImage"
												name="tweetImage"
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
									<Box sx={{ display: "flex", alignItems: "center" }}>
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
									</Box>
								</Box>
								<LoadingButton
									type="submit"
									loading={loading}
									sx={{
										padding: "5px 20px",
										borderRadius: "40px",
										textTransform: "none",
										background: "#1DA1F2",
										color: "#fff",
										":hover": { background: "#1da0f29c" },
									}}
								>
									Tweet
								</LoadingButton>
							</Box>
						</Box>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default EditTweetBoxDialog;
