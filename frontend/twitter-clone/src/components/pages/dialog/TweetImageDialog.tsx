import { Box, Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useEffect, useState } from "react";
import Tooltips from "../Items/Tooltips";
import TweetDetail from "../Tweet";

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
}: TweetImageDialogProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	const [toggleOpen, setToggleOpen] = useState<boolean>(false);

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
		setToggleOpen(false);
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
					<Tooltip title="Show">
						<IconButton
							sx={{ color: "white" }}
							onClick={() => setToggleOpen(!toggleOpen)}
						>
							{toggleOpen ? (
								<KeyboardDoubleArrowLeftOutlinedIcon />
							) : (
								<KeyboardDoubleArrowRightOutlinedIcon />
							)}
						</IconButton>
					</Tooltip>
				</Box>
				<Box sx={{ display: toggleOpen ? "flex" : "block" }}>
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
									width: toggleOpen ? "450px" : "100%",
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
					{toggleOpen && (
						<Box
							sx={{
								zIndex: 100,
								height: "100%",
								width: "70%",
								background: "#fff",
							}}
						>
							<TweetDetail />
						</Box>
					)}
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
					/>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default TweetImageDialog;
