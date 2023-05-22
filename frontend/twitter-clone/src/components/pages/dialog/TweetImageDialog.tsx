import { Box, Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useEffect, useState } from "react";
import Tooltips from "../Items/Tooltips";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

type TweetImageDialogProps = {
	open: boolean;
	onClose: () => void;
	images: string[];
	initialImageIndex: number;
	tweetId: string;
	userId: string;
	retweetUsers: string[];
	originalTweetId: string;
	handleCommentOpen: (tweetId: string) => void;
};

const TweetImageDialog = ({
	open,
	onClose,
	images,
	initialImageIndex,
	tweetId,
	userId,
	retweetUsers,
	originalTweetId,
	handleCommentOpen,
}: TweetImageDialogProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

	useEffect(() => {
		if (open) {
			setCurrentImageIndex(initialImageIndex);
		}
	}, [open, initialImageIndex]);

	const handleNext = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const handlePrev = () => {
		setCurrentImageIndex(
			(prevIndex) => (prevIndex - 1 + images.length) % images.length
		);
	};

	const onCloseWithExtraFunc = () => {
		onClose();
		setCurrentImageIndex(0);
	};

	return (
		<Dialog
			open={open}
			onClose={onCloseWithExtraFunc}
			fullScreen
			PaperProps={{
				style: {
					backgroundColor: "black",
				},
			}}
		>
			<DialogContent>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Tooltip title="Close">
						<IconButton onClick={onClose} sx={{ color: "white" }}>
							<CloseIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Box>
					<Box sx={{ mt: 10 }}>
						<Box
							sx={{
								zIndex: 10,
								position: "relative",
							}}
						>
							<img
								key={images[currentImageIndex]}
								src={IMAGE_URL + images[currentImageIndex]}
								alt="noImage"
								style={{
									height: "600px",
									width: "100%",
									transition: "opacity 1s ease-in-out",
								}}
							/>
							{currentImageIndex < images.length - 1 && (
								<IconButton
									sx={{
										color: "white",
										background: "#333333",
										position: "absolute",
										top: "50%",
										right: 30,
										":hover": {
											background: "#333333",
											opacity: 0.7,
										},
									}}
									onClick={handleNext}
								>
									<ArrowForwardOutlinedIcon />
								</IconButton>
							)}
							{currentImageIndex > 0 && (
								<IconButton
									sx={{
										color: "white",
										background: "#333333",
										position: "absolute",
										top: "50%",
										left: 30,
										":hover": {
											background: "#333333",
											opacity: 0.7,
										},
									}}
									onClick={handlePrev}
								>
									<ArrowBackOutlinedIcon />
								</IconButton>
							)}
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-evenly",
						mt: 10,
					}}
				>
					<Tooltips
						userId={userId}
						tweetId={tweetId}
						fontSize="30px"
						color="white"
						retweetUsers={retweetUsers}
						originalTweetId={originalTweetId}
						handleCommentOpen={handleCommentOpen}
					/>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default TweetImageDialog;
