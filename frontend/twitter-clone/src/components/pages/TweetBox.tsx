import { Typography, Box, TextField, Avatar, IconButton } from "@mui/material";
import noAvatar from "../../assets/images/noAvatar.png";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import tweetApi from "../../api/tweetApi";

type TweetBoxPropsType = {
	title: string | undefined;
	rows: number | undefined;
};

const TweetBox = ({ title, rows }: TweetBoxPropsType) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [tweet, setTweet] = useState<string>("");
	const [tweetErrMsg, setTweetErrMsg] = useState<string>("");
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		// バリデーション
		let err = false;

		// 改行と空白を除去した文字列を作成
		const trimmedTweet = tweet.replace(/(\r\n|\n|\r|\s)/g, "");

		if (!trimmedTweet) {
			err = true;
			setTweetErrMsg("ツイートを入力してください");
		} else if (tweet.length > 140) {
			err = true;
			setTweetErrMsg("ツイートは140文字以内で入力してください");
		}

		if (images.length > 4) {
			err = true;
			setTweetErrMsg("画像は4枚まで選択可能です");
		}

		if (err) return setLoading(false);
		const formData = new FormData();
		formData.append("content", tweet);
		images.forEach((image) => {
			formData.append("tweetImage", image);
		});

		// ツイート登録API呼出
		try {
			await tweetApi.create(formData);

			setLoading(false);
			console.log("ツイート登録に成功しました");
			setImagePreviews([]);
			setImages([]);
			setTweet("");
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography variant="h5">{title}</Typography>
			<Box
				component="form"
				encType="multipart/form-data"
				noValidate
				onSubmit={handleSubmit}
				sx={{ display: "flex", mr: "10px", maxWidth: 500 }}
			>
				<Avatar src={noAvatar} alt="noAvatar" sx={{ mt: "20px" }} />
				<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
					<TextField
						fullWidth
						variant="standard"
						id="tweet"
						name="tweet"
						value={tweet}
						rows={rows}
						label="What's happening?"
						placeholder="What's happening?"
						margin="normal"
						multiline
						onChange={(e) => setTweet(e.target.value)}
						error={tweetErrMsg !== ""}
						helperText={tweetErrMsg}
						inputProps={{ maxLength: 140 }}
					/>
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
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex" }}>
							<IconButton
								component="label"
								htmlFor="tweetImage"
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
	);
};

export default TweetBox;
