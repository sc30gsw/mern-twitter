import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";

const Register = () => {
	const navigate = useNavigate();
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
		if (!username) {
			err = true;
			setUsernameErrMsg("名前を入力してください");
		}

		if (!email) {
			err = true;
			setEmailErrMsg("メールアドレスを入力してください");
		}

		if (!password) {
			err = true;
			setPasswordErrMsg("パスワードを入力してください");
		}

		if (!confirmPassword) {
			err = true;
			setConfirmPasswordErrMsg("パスワード(確認用)を入力してください");
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
			navigate("/");
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);
			console.log(err.param);

			errors.map((err: any) => {
				switch (err.path) {
					case "username":
						setUsernameErrMsg(err.msg);
						break;

					case "email":
						setEmailErrMsg(err.msg);
						break;

					case "password":
						setPasswordErrMsg(err.msg);
						break;

					case "confirmPassword":
						setConfirmPasswordErrMsg(err.msg);
						break;
				}
			});

			setLoading(false);
		}
	};
	return (
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
					to="/login"
					sx={{
						fontSize: "1rem",
						padding: 0,
						mb: "2px",
						":hover": {
							textDecoration: "underline",
						},
					}}
				>
					ログイン
				</Button>
			</Typography>
		</Box>
	);
};

export default Register;
