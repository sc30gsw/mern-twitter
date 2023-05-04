import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../../../api/authApi";

type LoginDialogProps = {
	open: boolean;
	registerOpen: () => void;
	onClose: () => void;
};

const LoginDialog = ({ open, registerOpen, onClose }: LoginDialogProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	return (
		<Dialog
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiDialog-paper": {
					padding: "50px",
					borderRadius: "30px",
				},
			}}
		>
			<IconButton
				onClick={onClose}
				sx={{
					position: "absolute",
					top: 8,
					right: 8,
				}}
			>
				<CloseIcon />
			</IconButton>
			<DialogContent>
				<Typography variant="h4">アカウントを作成</Typography>
				<Box component="form" noValidate>
					<TextField
						fullWidth
						id="usernameOrEmail"
						name="usernameOrEmail"
						label="名前/Eメール"
						placeholder="名前またはメールアドレスを入力してください"
						margin="normal"
						required
					/>
					<TextField
						fullWidth
						type="password"
						id="password"
						name="password"
						label="パスワード"
						margin="normal"
						required
					/>
					<LoadingButton
						type="submit"
						fullWidth
						sx={{
							mt: 3,
							mb: 2,
							padding: "15px",
							borderRadius: "10px",
							bgcolor: "#14171A",
							color: "#F5F8FA",
							fontSize: "1rem",
							":hover": { background: "#14171A", opacity: 0.7 },
						}}
						color="primary"
						variant="contained"
						loading={loading}
					>
						ログイン
					</LoadingButton>
					<Typography>
						アカウントをお持ちでない場合は
						<Button
							component={Link}
							to="/"
							sx={{
								fontSize: "1rem",
								padding: 0,
								mb: "2px",
								":hover": {
									textDecoration: "underline",
								},
							}}
							onClick={() => {
								onClose();
								setTimeout(() => {
									registerOpen();
								}, 100);
							}}
						>
							登録
						</Button>
					</Typography>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;
