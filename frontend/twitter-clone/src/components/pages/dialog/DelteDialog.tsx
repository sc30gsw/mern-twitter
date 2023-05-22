import { Box, Dialog, DialogContent, Button, Typography } from "@mui/material";

type DeleteTweetDialogProps = {
	title: string;
	open: boolean;
	deleteId: string;
	onClose: () => void;
	handleDelete: (deleteId: string) => void;
};

const DeleteTweetDialog = ({
	title,
	open,
	deleteId,
	onClose,
	handleDelete,
}: DeleteTweetDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent sx={{ width: "300px" }}>
				<Box>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Delete {title} ?
					</Typography>
					<Typography variant="body2">
						{title === "Comment"
							? "This can’t be undone and it will be removed from tweet detail."
							: "This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results."}
					</Typography>
					<Button
						fullWidth
						variant="contained"
						color="error"
						sx={{
							textTransform: "none",
							mt: 3,
							padding: "10px 0",
							borderRadius: "30px",
							fontWeight: "bold",
						}}
						onClick={() => handleDelete(deleteId)}
					>
						Delete
					</Button>
					<Button
						fullWidth
						variant="outlined"
						sx={{
							textTransform: "none",
							mt: 2,
							padding: "10px 0",
							color: "black",
							borderRadius: "30px",
							border: "1px solid #e2e2e2",
							fontWeight: "bold",
							":hover": {
								border: "1px solid #e2e2e2",
								background: "#e2e2e2",
							},
						}}
						onClick={onClose}
					>
						Cancel
					</Button>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteTweetDialog;
