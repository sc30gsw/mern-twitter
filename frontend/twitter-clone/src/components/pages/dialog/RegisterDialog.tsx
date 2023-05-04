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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../../../api/authApi";

type RegisterDialogProps = {
	open: boolean;
	loginOpen: () => void;
	onClose: () => void;
};

const RegisterDialog = ({ open, loginOpen, onClose }: RegisterDialogProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [usernameErrMsg, setUsernameErrMsg] = useState<string>("");
	const [emailErrMsg, setEmailErrMsg] = useState<string>("");
	const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
	const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] =
		useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		setUsernameErrMsg("");
		setEmailErrMsg("");
		setPasswordErrMsg("");
		setConfirmPasswordErrMsg("");

		// 入力欄の値を取得
		const data = new FormData(e.target as HTMLFormElement);
		const username = data.get("username")?.toString().trim() as string;
		const email = data.get("email")?.toString().trim() as string;
		const password = data.get("password")?.toString().trim() as string;
		const confirmPassword = data
			.get("confirmPassword")
			?.toString()
			.trim() as string;

		// バリデーション
		let err = false;
		const emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
		if (!username) {
			err = true;
			setUsernameErrMsg("名前を入力してください");
		} else if (username.length < 8) {
			err = true;
			setUsernameErrMsg("名前は8文字以上で入力してください");
		}

		if (!email) {
			err = true;
			setEmailErrMsg("メールアドレスを入力してください");
		} else if (!emailFormat.test(email)) {
			err = true;
			setEmailErrMsg("有効なメールアドレスを入力してください");
		}

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

		// 新規登録API呼出
		try {
			const res = await authApi.register({
				username,
				email,
				password,
				confirmPassword,
			});

			localStorage.setItem("token", res.data.token);
			setLoading(false);

			console.log("新規登録に成功しました");
			onClose();
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);

			setLoading(false);
		}
	};
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
				<Box component="form" onSubmit={handleSubmit} noValidate>
					<TextField
						fullWidth
						id="username"
						name="username"
						label="名前"
						margin="normal"
						required
						helperText={usernameErrMsg}
						error={usernameErrMsg !== ""}
						disabled={loading}
					/>
					<TextField
						fullWidth
						type="email"
						name="email"
						id="email"
						label="Email"
						margin="normal"
						required
						helperText={emailErrMsg}
						error={emailErrMsg !== ""}
						disabled={loading}
					/>
					<TextField
						fullWidth
						type="password"
						id="password"
						name="password"
						label="パスワード"
						margin="normal"
						required
						helperText={passwordErrMsg}
						error={passwordErrMsg !== ""}
						disabled={loading}
					/>
					<TextField
						fullWidth
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						label="確認用パスワード"
						margin="normal"
						required
						helperText={confirmPasswordErrMsg}
						error={confirmPasswordErrMsg !== ""}
						disabled={loading}
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
						登録
					</LoadingButton>
					<Typography>
						アカウントをお持ちの場合は
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
									loginOpen();
								}, 100);
							}}
						>
							ログイン
						</Button>
					</Typography>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default RegisterDialog;
