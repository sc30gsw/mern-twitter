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
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import noAvatar from "../../assets/images/noAvatar.png";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import styled from "@emotion/styled";
import Tooltips from "./Items/Tooltips";

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
				width: "calc(50% - 4px)", // 4px はマージンを考慮した値です
				height: "auto",
			};
		default:
			return {};
	}
};

const TweetDetail = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
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
					<IconButton component={Link} to={"/"}>
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
						<IconButton component={Link} to={"/"}>
							<Avatar />
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
									to={`/user/`}
									style={{ color: "black", textDecoration: "none" }}
								>
									プロフィール名前
								</Link>
							</Typography>
							<Typography
								component="span"
								variant="body2"
								sx={{
									color: "#898989",
								}}
							>
								{/* {tweet.user.username}・{formatDate(tweet.updatedAt)} */}
								ユーザー名
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
				{/* <Typography>{tweet.content}</Typography> */}
				<Typography>
					自分が見てほしいアウトプットツイートには全然いいね来ないのに、くさい自己啓発ツイートにはめっちゃいいねつくの悲しい
					全然本質的にじゃないけど、他人受け良さそうなくさい自己啓発ツイートした方が評判良くなるそうした方がええんか？
				</Typography>
				{/* {tweet.tweetImage.map((image, index) => (
							<TweetImage
								key={image + index}
								src={IMAGE_URL + image}
								alt={image}
								imageCount={tweet.tweetImage.length}
							/>
						))} */}
				<Typography
					variant="body1"
					mt={2}
					sx={{
						display: "flex",
						color: "#898989",
					}}
				>
					{/* {tweet.user.username}・{formatDate(tweet.updatedAt)} */}
					7:27 PM・May 11,2023・
					<Typography
						variant="body1"
						mr={"5px"}
						sx={{ color: "black", fontWeight: "bold" }}
					>
						3,902
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
					1
				</Typography>
				<Typography variant="body1" ml={"1px"} sx={{ color: "#898989" }}>
					Retweet
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
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-around",
					padding: "10px 0",
					ml: "20px",
					borderBottom: "solid 1px #cacaca",
				}}
			>
				<Tooltips fontSize={"30px"} />
			</Box>
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
				<Link to={`/`}>
					<Avatar
						// src={user?.icon ? IMAGE_URL + user?.icon : noAvatar}
						src={noAvatar}
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
					{/* 画像プレビュー */}
					{/* <Box sx={{ display: "flex", flexWrap: "wrap", position: "relative" }}>
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
					</Box> */}
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
								<Tooltips fontSize={"20px"} />
							</Box>
						</Box>
					</ListItem>
				</List>
			</Box>
		</>
	);
};

export default TweetDetail;
