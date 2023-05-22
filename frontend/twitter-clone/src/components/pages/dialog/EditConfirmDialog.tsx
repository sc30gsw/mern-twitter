import { Box, Dialog, DialogContent, Button, Typography } from "@mui/material";

type EditConfirmDialogProps = {
	open: boolean;
	onClose: () => void;
	discard: () => void;
};

const EditConfirmDialog = ({
	open,
	onClose,
	discard,
}: EditConfirmDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent sx={{ width: "300px" }}>
				<Box>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Discard changes?
					</Typography>
					<Typography variant="body2">
						This can’t be undone and you’ll lose your changes.{" "}
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
						onClick={discard}
					>
						Discard
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

export default EditConfirmDialog;
