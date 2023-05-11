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
import authApi from "../../../api/authApi";
import Home from "../Home";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordDialog = () => {
	const { setUser, triggerSettingPasswordEvent } = useUserContext();
	const pathname = useLocation().pathname.split("/").pop();
	const navigate = useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(true);
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
	const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] =
		useState<string>("");
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>(false);

	const onCloseWithExtraFunc = () => {
		setOpen(false);
		setLoading(false);
		setPassword("");
		setConfirmPassword("");
		setPasswordErrMsg("");
		setConfirmPasswordErrMsg("");
		setPasswordVisible(false);
		setConfirmPasswordVisible(false);
	};

	const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
	const toggleConfirmPasswordVisibility = () =>
		setConfirmPasswordVisible(!confirmPasswordVisible);

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		let err = false;

		if (!password) {
			err = true;
			setPasswordErrMsg("パスワードを入力してください");
		} else if (password.length < 8) {
			err = true;
			setPasswordErrMsg("パスワードは8文字以上で入力してください");
		}

		if (!confirmPassword) {
			err = true;
			setConfirmPasswordErrMsg("パスワード(確認用)を入力してください");
		} else if (confirmPassword.length < 8) {
			err = true;
			setConfirmPasswordErrMsg(
				"パスワード(確認用)は8文字以上で入力してください"
			);
		}

		if (password !== confirmPassword) {
			err = true;
			setConfirmPasswordErrMsg("パスワードとパスワード(確認用)が一致しません");
		}

		if (err) return setLoading(false);

		try {
			const res = await authApi.resetPassword({
				resetToken: pathname as string,
				password: password,
				confirmPassword: confirmPassword,
			});

			const updatedUser = res.data.updatedUser;
			setUser({
				id: updatedUser._id,
				profileName: updatedUser.profileName,
				username: updatedUser.username,
				email: updatedUser.email,
				icon: updatedUser.icon,
				description: updatedUser.description,
				profileImg: updatedUser.profileImg,
				version: updatedUser.__v,
			});

			onCloseWithExtraFunc();
			triggerSettingPasswordEvent();
			console.log("パスワード再設定に成功しました");
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
			onCloseWithExtraFunc();
		} finally {
			navigate("/auth");
			localStorage.removeItem("user");
		}
	};
	return (
		<>
			<Home />
			<Dialog
				open={open}
				onClose={onCloseWithExtraFunc}
				sx={{
					"& .MuiDialog-paper": {
						padding: "50px",
						borderRadius: "30px",
					},
				}}
			>
				<IconButton
					onClick={onCloseWithExtraFunc}
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
					}}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent sx={{ width: "400px" }}>
					<Box sx={{ textAlign: "center" }}>
						<Twitter sx={{ color: "#1DA1F2", fontSize: "40px" }} />
						<Typography variant="h4">パスワードを再設定</Typography>
					</Box>
					<Typography variant="subtitle2">
						パスワードをリセットしました。再度、パスワードを設定してください。
					</Typography>
					<Box component="form" noValidate onSubmit={handleResetPassword}>
						<TextField
							fullWidth
							type={passwordVisible ? "text" : "password"}
							id="password"
							name="password"
							value={password}
							label="パスワード"
							margin="normal"
							required
							onChange={(e) => setPassword(e.target.value)}
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
							value={confirmPassword}
							label="確認用パスワード"
							margin="normal"
							required
							onChange={(e) => setConfirmPassword(e.target.value)}
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
							type="submit"
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
							パスワードを再設定
						</LoadingButton>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ResetPasswordDialog;
