import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";
import { useUserContext } from "../../../contexts/UserProvider";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { Twitter } from "@mui/icons-material";

type LoginDialogProps = {
	open: boolean;
	registerOpen: () => void;
	onClose: () => void;
};

const LoginDialog = ({ open, registerOpen, onClose }: LoginDialogProps) => {
	const navigate = useNavigate();

	const { setUser } = useUserContext();

	const [loading, setLoading] = useState<boolean>(false);
	const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);
	const [usernameOrEmailErrMsg, setUsernameOrEmailErrMsg] =
		useState<string>("");
	const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

	const handleForgotPasswordOpen = () => setForgotPasswordOpen(true);
	const handleForgotPasswordClose = () => setForgotPasswordOpen(false);

	const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		setUsernameOrEmailErrMsg("");
		setPasswordErrMsg("");

		// 入力欄の値を取得
		const data = new FormData(e.target as HTMLFormElement);
		const usernameOrEmail = data
			.get("usernameOrEmail")
			?.toString()
			.trim() as string;
		const password = data.get("password")?.toString().trim() as string;

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

		if (!password) {
			err = true;
			setPasswordErrMsg("パスワードを入力してください");
		} else if (password.length < 8) {
			err = true;
			setPasswordErrMsg("パスワードは8文字以上で入力してください");
		}

		if (err) return setLoading(false);

		// ログインAPI呼出
		try {
			const res = await authApi.login({
				username,
				email,
				password,
			});

			localStorage.setItem("token", res.data.token);

			const user = res.data.user;
			setUser({
				id: user._id,
				profileName: user.profileName,
				username: user.username,
				email: user.email,
				icon: user.icon,
				description: user.description,
				profileImg: user.profileImg,
				version: user.__v,
			});

			setLoading(false);

			console.log("ログインに成功しました");
			onClose();
			navigate("/");
		} catch (err: any) {
			const errors = err.data.errors;
			errors.map((err: any) => {
				switch (err.param) {
					case "username or email":
						setUsernameOrEmailErrMsg(err.msg);
						break;

					case "password":
						setPasswordErrMsg(err.msg);
						break;
				}
			});

			setLoading(false);
		}
	};

	return (
		<>
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
				<DialogContent sx={{ width: "400px" }}>
					<Box sx={{ textAlign: "center" }}>
						<Twitter sx={{ color: "#1DA1F2", fontSize: "40px" }} />
						<Typography variant="h4">Twitterにログイン</Typography>
					</Box>
					<Box component="form" noValidate onSubmit={handleSubmit}>
						<TextField
							fullWidth
							id="usernameOrEmail"
							name="usernameOrEmail"
							label="ユーザー名/Eメール"
							placeholder="ユーザー名またはメールアドレスを入力"
							margin="normal"
							required
							error={usernameOrEmailErrMsg !== ""}
							helperText={usernameOrEmailErrMsg}
						/>
						<TextField
							fullWidth
							type={passwordVisible ? "text" : "password"}
							id="password"
							name="password"
							label="パスワード"
							margin="normal"
							required
							error={passwordErrMsg !== ""}
							helperText={passwordErrMsg}
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
						<Button
							component={Link}
							to="/auth"
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
									handleForgotPasswordOpen();
								}, 100);
							}}
						>
							パスワードを忘れた場合はこちら
						</Button>
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
								to="/auth"
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
			<ForgotPasswordDialog
				open={forgotPasswordOpen}
				onClose={handleForgotPasswordClose}
			/>
		</>
	);
};

export default LoginDialog;
