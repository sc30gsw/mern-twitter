import {
	Box,
	Dialog,
	DialogContent,
	IconButton,
	Slide,
	Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
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
};

const TweetImageDialog = ({
	open,
	onClose,
	images,
	initialImageIndex,
}: TweetImageDialogProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	const [direction, setDirection] = useState<
		"right" | "left" | "up" | "down" | undefined
	>(undefined);

	useEffect(() => {
		if (open) {
			setCurrentImageIndex(initialImageIndex);
		}
	}, [open, initialImageIndex]);

	const handleNext = () => {
		setDirection("left");
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const handlePrev = () => {
		setCurrentImageIndex(
			(prevIndex) => (prevIndex - 1 + images.length) % images.length
		);
	};

	const onCloseWithExtraFunc = () => {
		onClose();
		setDirection(undefined);
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
					<Tooltip title="Show">
						<IconButton sx={{ color: "white" }}>
							<KeyboardDoubleArrowLeftOutlinedIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Box sx={{ mt: 10 }}>
					{images.map((image, index) => (
						<Slide
							key={image + index}
							in={index === currentImageIndex}
							direction={direction}
							timeout={400}
							mountOnEnter
							unmountOnExit
						>
							<img
								src={IMAGE_URL + image}
								alt="noImage"
								style={{
									height: "600px",
									width: "100%",
									position:
										index === currentImageIndex ? "relative" : "absolute",
									transition: "opacity 1s ease-in-out",
								}}
							/>
						</Slide>
					))}
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
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-evenly",
						mt: 10,
					}}
				>
					<Tooltips fontSize="30px" color="white" />
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default TweetImageDialog;
