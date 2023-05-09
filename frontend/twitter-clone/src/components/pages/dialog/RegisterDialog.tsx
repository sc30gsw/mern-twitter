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
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";
import { useUserContext } from "../../../contexts/UserProvider";
import { Twitter, Visibility, VisibilityOff } from "@mui/icons-material";

type RegisterDialogProps = {
	open: boolean;
	loginOpen: () => void;
	onClose: () => void;
};

const generateRandomString = (length: number) => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return result;
};

const RegisterDialog = ({ open, loginOpen, onClose }: RegisterDialogProps) => {
	const navigate = useNavigate();
	const { setUser } = useUserContext();

	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [profileName, setProfileName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [username, setUsername] = useState<string>(
		`@${generateRandomString(15)}`
	);
	const [profileNameErrMsg, setProfileNameErrMsg] = useState<string>("");
	const [emailErrMsg, setEmailErrMsg] = useState<string>("");
	const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
	const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] =
		useState<string>("");
	const [usernameErrMsg, setUsernameErrMsg] = useState<string>("");
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>(false);

	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// keyDownEventで2ページ目にパスワード(確認用)に自動フォーカスされるため、フォーカスを外すようにする
		if (page === 2 && confirmPasswordRef.current) {
			confirmPasswordRef.current.blur();
		}
	}, [page]);

	const onCloseWithExtraFunc = () => {
		onClose();
		setLoading(false);
		setPage(1);
		setProfileName("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setUsername(`@${generateRandomString(15)}`);
		setProfileNameErrMsg("");
		setEmailErrMsg("");
		setPasswordErrMsg("");
		setConfirmPasswordErrMsg("");
		setPasswordVisible(false);
		setConfirmPasswordVisible(false);
	};

	// パスワードの表示・非表示
	const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
	const toggleConfirmPasswordVisibility = () =>
		setConfirmPasswordVisible(!confirmPasswordVisible);

	const validFirstPage = () => {
		setLoading(true);

		let err = false;
		const emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;

		if (!profileName) {
			err = true;
			setProfileNameErrMsg("名前を入力してください");
		} else if (profileName.length < 8) {
			err = true;
			setProfileNameErrMsg("名前は8文字以上で入力してください");
		}

		if (!email) {
			err = true;
			setEmailErrMsg("メールアドレスを入力してください");
		} else if (!emailFormat.test(email)) {
			err = true;
			setEmailErrMsg("有効なメールアドレスを入力してください");
		}

		if (err) return setLoading(false);

		setLoading(false);
		setPage(page + 1);
	};

	const validSecondPage = () => {
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

		setLoading(false);
		setPage(page + 1);
	};

	const handleClick = async () => {
		setLoading(true);

		// バリデーション
		let err = false;
		const usernameFormat = /^\w+$/;

		if (!username) {
			err = true;
			setUsernameErrMsg("ユーザー名を入力してください");
		} else if (
			!username.startsWith("@") ||
			!usernameFormat.test(username.slice(1))
		) {
			err = true;
			setUsernameErrMsg("ユーザー名は@で始まり、半角英数字で入力してください");
		}

		if (err) return setLoading(false);

		// 新規登録API呼出
		try {
			const res = await authApi.register({
				username,
				profileName,
				email,
				password,
				confirmPassword,
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
			console.log("新規登録に成功しました");
			onCloseWithExtraFunc();
			navigate("/");
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			setLoading(false);
		}
	};

	// Enterキーでもページネーション可能になるようにする
	const handleKeyDown = (e: any) => {
		if (e.key === "Enter") {
			e.preventDefault();
			switch (page) {
				case 1:
					validFirstPage();
					break;

				case 2:
					validSecondPage();
					break;

				case 3:
					handleClick();
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
				<Box sx={{ textAlign: "center" }}>
					<Twitter sx={{ color: "#1DA1F2", fontSize: "40px" }} />
					<Typography variant="h4">アカウントを作成</Typography>
				</Box>
				<Box component="form" noValidate onKeyDown={handleKeyDown}>
					{page === 1 ? (
						<>
							<TextField
								fullWidth
								id="profileName"
								name="profileName"
								value={profileName}
								label="名前"
								margin="normal"
								required
								onChange={(e) => setProfileName(e.target.value)}
								helperText={profileNameErrMsg}
								error={profileNameErrMsg !== ""}
							/>
							<TextField
								fullWidth
								type="email"
								name="email"
								value={email}
								id="email"
								label="Email"
								margin="normal"
								required
								onChange={(e) => setEmail(e.target.value)}
								helperText={emailErrMsg}
								error={emailErrMsg !== ""}
								disabled={loading}
							/>
						</>
					) : page === 2 ? (
						<>
							<TextField
								fullWidth
								type={passwordVisible ? "text" : "password"}
								id="password"
								name="password"
								value={password}
								label="パスワード"
								onChange={(e) => setPassword(e.target.value)}
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
								inputRef={confirmPasswordRef}
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
						</>
					) : page === 3 ? (
						<TextField
							fullWidth
							id="userName"
							name="userName"
							value={username}
							label="ユーザー名"
							margin="normal"
							required
							onChange={(e) => setUsername(e.target.value)}
							helperText={usernameErrMsg}
							error={usernameErrMsg !== ""}
							disabled={loading}
						/>
					) : (
						<></>
					)}
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						{page !== 1 && (
							<Button
								sx={{
									width: "45%",
									mt: 3,
									mb: 2,
									padding: "15px",
									borderRadius: "10px",
									bgcolor: "#f7f7f7",
									color: "#14171A",
									fontSize: "1rem",
									":hover": { background: "#F5F8FA", opacity: 0.7 },
								}}
								color="primary"
								variant="contained"
								onClick={() => {
									setPage(page - 1);
								}}
							>
								戻る
							</Button>
						)}
						<LoadingButton
							sx={{
								width: page === 1 ? "100%" : "45%",
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
							onClick={
								page === 1
									? validFirstPage
									: page === 2
									? validSecondPage
									: handleClick
							}
						>
							{page === 3 ? "登録" : "次へ"}
						</LoadingButton>
					</Box>
					{page === 1 && (
						<Typography>
							アカウントをお持ちの場合は
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
									onCloseWithExtraFunc();
									setTimeout(() => {
										loginOpen();
									}, 100);
								}}
							>
								ログイン
							</Button>
						</Typography>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default RegisterDialog;
