import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import RegisterDialog from "./dialog/RegisterDialog";
import LoginDialog from "./dialog/LoginDialog";

const AccountButtonArea = () => {
	const [registerOpen, setRegisterOpen] = useState<boolean>(false);
	const [loginOpen, setLoginOpen] = useState<boolean>(false);

	const handleRegisterOpen = () => setRegisterOpen(true);
	const handleRegisterClose = () => setRegisterOpen(false);

	const handleLoginOpen = () => setLoginOpen(true);
	const handleLoginClose = () => setLoginOpen(false);

	return (
		<>
			<Box sx={{ mt: "10px", ml: "10px", textAlign: "center" }}>
				<Typography variant="h6" sx={{ fontWeight: "bold" }}>
					Twitterを使ってみよう
				</Typography>
				<Typography variant="caption" display="block" sx={{ color: "#999b9d" }}>
					今すぐ登録して、タイムラインをカスタマイズしましょう。
				</Typography>
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					<Button
						sx={{
							mt: "10px",
							padding: "10px 20px",
							borderRadius: "40px",
							border: "solid 1px #5c5d5d",
							textTransform: "none",
							fontSize: "18px",
							background: "#fff",
							color: "black",
							":hover": { opacity: 0.7 },
						}}
						onClick={handleRegisterOpen}
					>
						アカウントを作成
					</Button>
					<Button
						sx={{
							mt: "10px",
							padding: "10px 20px",
							borderRadius: "40px",
							border: "solid 1px #5c5d5d",
							textTransform: "none",
							fontSize: "18px",
							background: "#fff",
							color: "black",
							":hover": { opacity: 0.7 },
						}}
						onClick={handleLoginOpen}
					>
						ログイン
					</Button>
				</Box>
			</Box>
			<RegisterDialog
				open={registerOpen}
				loginOpen={handleLoginOpen}
				onClose={handleRegisterClose}
			/>
			<LoginDialog
				open={loginOpen}
				registerOpen={handleRegisterOpen}
				onClose={handleLoginClose}
			/>
		</>
	);
};

export default AccountButtonArea;
