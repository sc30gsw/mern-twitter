import { LoadingButton } from "@mui/lab";
import {
	Box,
	Dialog,
	DialogContent,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Twitter, Visibility, VisibilityOff } from "@mui/icons-material";
import { useUserContext } from "../../../contexts/UserProvider";

type ForgotPasswordDialogProps = {
	open: boolean;
	onClose: () => void;
};

const ForgotPasswordDialog = ({ open, onClose }: ForgotPasswordDialogProps) => {
	const { triggerSettingPasswordEvent } = useUserContext();

	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [usernameOrEmailErrMsg, setUsernameOrEmailErrMsg] =
		useState<string>("");
	const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
	const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] =
		useState<string>("");
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>(false);

	const handleNext = () => setPage(page + 1);

	const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
	const toggleConfirmPasswordVisibility = () =>
		setConfirmPasswordVisible(!confirmPasswordVisible);

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
				{page === 1 && (
					<>
						<Box sx={{ textAlign: "center" }}>
							<Twitter sx={{ color: "#1DA1F2", fontSize: "40px" }} />
							<Typography variant="h4">アカウントを探す</Typography>
						</Box>
						<Typography variant="subtitle2">
							パスワードを変更するには、アカウントに登録されたメールアドレス、またはユーザー名を入力してください。
						</Typography>
					</>
				)}
				{page === 2 && (
					<>
						<Box sx={{ textAlign: "center" }}>
							<Twitter sx={{ color: "#1DA1F2", fontSize: "40px" }} />
							<Typography variant="h4">パスワードを再設定</Typography>
						</Box>
						<Typography variant="subtitle2">
							パスワードをリセットしました。再度、パスワードを設定してください。
						</Typography>
					</>
				)}
				<Box component="form" noValidate>
					{page === 1 && (
						<>
							<TextField
								fullWidth
								id="usernameOrEmail"
								name="usernameOrEmail"
								label="名前/Eメール"
								placeholder="名前またはメールアドレスを入力してください"
								margin="normal"
								required
								error={usernameOrEmailErrMsg !== ""}
								helperText={usernameOrEmailErrMsg}
							/>
							<LoadingButton
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
								onClick={handleNext}
							>
								次へ
							</LoadingButton>
						</>
					)}
					{page === 2 && (
						<>
							<TextField
								fullWidth
								type={passwordVisible ? "text" : "password"}
								id="password"
								name="password"
								label="パスワード"
								margin="normal"
								required
								helperText={passwordErrMsg}
								error={passwordErrMsg !== ""}
								disabled={loading}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton edge="end" onClick={togglePasswordVisibility}>
												{passwordVisible ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<TextField
								fullWidth
								type={confirmPasswordVisible ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								label="確認用パスワード"
								margin="normal"
								required
								helperText={confirmPasswordErrMsg}
								error={confirmPasswordErrMsg !== ""}
								disabled={loading}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												edge="end"
												onClick={toggleConfirmPasswordVisibility}
											>
												{confirmPasswordVisible ? (
													<VisibilityOff />
												) : (
													<Visibility />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<LoadingButton
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
								onClick={() => {
									onClose();
									triggerSettingPasswordEvent();
								}}
							>
								パスワードを再設定
							</LoadingButton>
						</>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default ForgotPasswordDialog;
