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

type ForgotPasswordDialogProps = {
	open: boolean;
	onClose: () => void;
};

const ForgotPasswordDialog = ({ open, onClose }: ForgotPasswordDialogProps) => {
	const { user, setUser, triggerSettingPasswordEvent } = useUserContext();

	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [usernameOrEmailErrMsg, setUsernameOrEmailErrMsg] =
		useState<string>("");
	const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
	const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] =
		useState<string>("");
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>(false);

	const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
	const toggleConfirmPasswordVisibility = () =>
		setConfirmPasswordVisible(!confirmPasswordVisible);

	const onCloseWithExtraFunc = () => {
		onClose();
		setLoading(false);
		setUsernameOrEmail("");
		setPassword("");
		setConfirmPassword("");
		setUsernameOrEmailErrMsg("");
		setPasswordErrMsg("");
		setConfirmPasswordErrMsg("");
		setPasswordVisible(false);
		setConfirmPasswordVisible(false);
		setPage(1);
	};

	const handleForgotPassword = async () => {
		setLoading(true);

		setUsernameOrEmailErrMsg("");
		setPasswordErrMsg("");

		// バリデーション
		let err = false;

		let username;
		let email;

		const emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
		const usernameFormat = /^\w+$/;

		if (!usernameOrEmail) {
			setUsernameOrEmailErrMsg(
				"ユーザー名またはメールアドレスを入力してください"
			);
			err = true;
		} else if (emailFormat.test(usernameOrEmail)) {
			email = usernameOrEmail;
			username = "";
		} else if (
			!usernameOrEmail.startsWith("@") ||
			!usernameFormat.test(usernameOrEmail.slice(1))
		) {
			setUsernameOrEmailErrMsg(
				"ユーザー名は@で始まり、半角英数字で入力してください"
			);
			err = true;
		} else {
			username = usernameOrEmail;
			email = "";
		}

		if (err) return setLoading(false);

		// パスワード忘れリクエストAPI呼出
		try {
			const res = await authApi.forgotPassword({
				username,
				email,
			});

			const data = res.data.user;
			setUser({
				id: data._id,
				profileName: data.profileName,
				username: data.username,
				email: data.email,
				icon: data.icon,
				description: data.description,
				profileImg: data.profileImg,
				version: data.__v,
			});

			setLoading(false);

			console.log("パスワード再設定リクエストに成功しました");
			setPage(page + 1);
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);

			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
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
				username: user?.username,
				email: user?.email,
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
			console.log(err);
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
			onCloseWithExtraFunc();
		} finally {
			localStorage.removeItem("user");
		}
	};

	// Enterキーでもページネーション可能になるようにする
	const handleKeyDown = (e: any) => {
		if (e.key === "Enter") {
			e.preventDefault();
			switch (page) {
				case 1:
					handleForgotPassword();
					break;

				case 2:
					handleResetPassword();
					break;
			}
		}
	};

	return (
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
				<Box component="form" noValidate onKeyDown={handleKeyDown}>
					{page === 1 && (
						<>
							<TextField
								fullWidth
								id="usernameOrEmail"
								name="usernameOrEmail"
								value={usernameOrEmail}
								label="ユーザー名/Eメール"
								placeholder="ユーザー名またはメールアドレスを入力"
								margin="normal"
								required
								onChange={(e) => setUsernameOrEmail(e.target.value)}
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
								onClick={handleForgotPassword}
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
								onClick={handleResetPassword}
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
