import {
	Alert,
	Collapse,
	CssBaseline,
	IconButton,
	Slide,
	ThemeProvider,
	Typography,
	createTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import { useEffect, useState } from "react";
import { useUserContext } from "./contexts/UserProvider";
import Profile from "./components/pages/Profile";
import Home from "./components/pages/Home";
import ResetPasswordDialog from "./components/pages/dialog/ResetPasswordDialog";
import TweetDetail from "./components/pages/Tweet";
import EditTweet from "./components/pages/EditTweet";

const App = () => {
	const { logoutEvent, settingPasswordEvent } = useUserContext();
	const [open, setOpen] = useState<boolean>(false);
	const [settingPasswordOpen, setSettingPasswordOpen] =
		useState<boolean>(false);

	useEffect(() => {
		if (logoutEvent) setOpen(true);
		if (settingPasswordEvent) setSettingPasswordOpen(true);
	}, [logoutEvent, settingPasswordEvent]);

	const theme = createTheme({
		palette: {
			primary: {
				main: "#1DA1F2",
			},
			secondary: {
				main: "#657786",
			},
			background: {
				default: "#FFFFFF",
			},
			text: {
				primary: "#14171A",
				secondary: "#657786",
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{open && (
				<Slide direction="down" in={open}>
					<Collapse in={open}>
						<Alert
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => {
										setOpen(false);
									}}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
							sx={{ mb: 2 }}
							severity="success"
						>
							<Typography variant="body2" sx={{ fontWeight: "bold" }}>
								Logout Successful!
							</Typography>
						</Alert>
					</Collapse>
				</Slide>
			)}
			{settingPasswordOpen && (
				<Slide direction="down" in={settingPasswordOpen}>
					<Collapse in={settingPasswordOpen}>
						<Alert
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => {
										setSettingPasswordOpen(false);
									}}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
							sx={{ mb: 2 }}
							severity="success"
						>
							<Typography variant="body2" sx={{ fontWeight: "bold" }}>
								パスワード再設定が完了しました！
							</Typography>
						</Alert>
					</Collapse>
				</Slide>
			)}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<AppLayout />}>
						<Route path="/" element={<Home />} />
						<Route path="/user/:username" element={<Profile />} />
						<Route path="/tweet/:tweetId" element={<TweetDetail />} />
						<Route path="/editTweet/:tweetId" element={<EditTweet />} />
					</Route>
					<Route path="/auth" element={<AuthLayout />}>
						<Route path="/auth" element={<Home />} />
						<Route
							path="/auth/reset/:resetToken"
							element={<ResetPasswordDialog />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
