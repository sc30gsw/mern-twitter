import {
	Alert,
	Collapse,
	CssBaseline,
	IconButton,
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

const App = () => {
	const { logoutEvent } = useUserContext();
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		if (logoutEvent) setOpen(true);
	}, [logoutEvent]);

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
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<AppLayout />} />
					<Route path="/auth" element={<AuthLayout />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
