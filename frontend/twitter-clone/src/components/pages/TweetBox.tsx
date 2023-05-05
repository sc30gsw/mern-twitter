import {
	Typography,
	Box,
	TextField,
	Avatar,
	IconButton,
	Button,
} from "@mui/material";
import noAvatar from "../../assets/images/noAvatar.png";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

type TweetBoxPropsType = {
	title: string | undefined;
	rows: number | undefined;
};

const TweetBox = ({ title, rows }: TweetBoxPropsType) => {
	return (
		<Box>
			<Typography variant="h5">{title}</Typography>
			<Box
				component="form"
				noValidate
				sx={{ display: "flex", mr: "10px", maxWidth: 500 }}
			>
				<Avatar src={noAvatar} alt="noAvatar" sx={{ mt: "20px" }} />
				<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
					<TextField
						fullWidth
						variant="standard"
						id="tweet"
						name="tweet"
						rows={rows}
						label="What's happening?"
						placeholder="What's happening?"
						margin="normal"
						multiline
						inputProps={{ maxLength: 140 }}
					/>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex" }}>
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
						<Button
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
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default TweetBox;
