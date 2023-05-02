import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
	const [loading, setLoading] = useState<boolean>(false);
	return (
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
					to="/register"
					sx={{
						fontSize: "1rem",
						padding: 0,
						mb: "2px",
						":hover": {
							textDecoration: "underline",
						},
					}}
				>
					登録
				</Button>
			</Typography>
		</Box>
	);
};

export default Login;
