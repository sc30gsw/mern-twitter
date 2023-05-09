import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TweetBox from "../TweetBox";

type TweetBoxDialogProps = {
	open: boolean;
	onClose: () => void;
};

const TweetBoxDialog = ({ open, onClose }: TweetBoxDialogProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="tweet-box-dialog"
			sx={{
				"& .MuiDialog-paper": {
					width: "70%",
					height: "40%",
					position: "relative",
					borderRadius: "30px",
					minWidth: 320,
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
				<TweetBox title={undefined} rows={4} />
			</DialogContent>
		</Dialog>
	);
};

export default TweetBoxDialog;
