import { LoadingButton } from "@mui/lab";
import {
	Alert,
	Box,
	Collapse,
	Dialog,
	DialogContent,
	IconButton,
	Slide,
	TextField,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Twitter } from "@mui/icons-material";
import { useUserContext } from "../../../contexts/UserProvider";
import authApi from "../../../api/authApi";

type ForgotPasswordDialogProps = {
	open: boolean;
	onClose: () => void;
};

const ForgotPasswordDialog = ({ open, onClose }: ForgotPasswordDialogProps) => {
	const { setUser } = useUserContext();

	const [loading, setLoading] = useState<boolean>(false);
	const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
	const [usernameOrEmailErrMsg, setUsernameOrEmailErrMsg] =
		useState<string>("");
	const [sendMailOpen, setSendMailOpen] = useState<boolean>(false);

	const onCloseWithExtraFunc = () => {
		onClose();
		setLoading(false);
		setUsernameOrEmail("");
		setUsernameOrEmailErrMsg("");
	};

	const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		setUsernameOrEmailErrMsg("");

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

		// パスワードリセット通知API呼出
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
			setUsernameOrEmail("");
			setSendMailOpen(true);

			console.log("パスワード再設定リクエストに成功しました");
		} catch (err: any) {
			const errors = err.data.errors;
			console.log(errors);

			setLoading(false);
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
			<Slide direction="down" in={sendMailOpen}>
				<Collapse
					in={sendMailOpen}
					sx={{ position: "absolute", top: 1, left: 2, width: "500px" }}
				>
					<Alert
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setSendMailOpen(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
						severity="success"
					>
						<Typography variant="body2" sx={{ fontWeight: "bold" }}>
							メールを送信しました
						</Typography>
					</Alert>
				</Collapse>
			</Slide>
			<IconButton
				onClick={onCloseWithExtraFunc}
				sx={{
					display: sendMailOpen ? "none" : "block",
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
					<Typography variant="h4">アカウントを探す</Typography>
				</Box>
				<Typography variant="subtitle2">
					パスワードを変更するには、アカウントに登録されたメールアドレス、またはユーザー名を入力してください。
				</Typography>
				<Box component="form" noValidate onSubmit={handleForgotPassword}>
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
						メールを送信
					</LoadingButton>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default ForgotPasswordDialog;
