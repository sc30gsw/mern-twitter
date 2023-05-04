import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";

const App = () => {
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
