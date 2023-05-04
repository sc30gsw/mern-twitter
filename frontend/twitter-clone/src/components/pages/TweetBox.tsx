import { Typography, Box, TextField, Avatar, IconButton } from "@mui/material";
import noAvatar from "../../assets/images/noAvatar.png";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const TweetBox = () => {
	return (
		<>
			<Typography variant="h5">Home</Typography>
			<Box
				component="form"
				noValidate
				sx={{ display: "flex", mr: "10px", maxWidth: 500 }}
			>
				<Avatar src={noAvatar} alt="noAvatar" />
				<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
					<TextField
						fullWidth
						variant="standard"
						id="usernameOrEmail"
						name="usernameOrEmail"
						label="What's happening?"
						placeholder="What's happening?"
						margin="normal"
						multiline
						inputProps={{ maxLength: 140 }}
					/>
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
				</Box>
			</Box>
		</>
	);
};

export default TweetBox;
