import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
	const [loading, setLoading] = useState<boolean>(false);
	return (
		<Box component="form" noValidate>
			<TextField
				fullWidth
				id="username"
				name="username"
				label="名前"
				margin="normal"
				required
			/>
			<TextField
				fullWidth
				type="email"
				name="email"
				id="email"
				label="Email"
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
			<TextField
				fullWidth
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				label="確認用パスワード"
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
