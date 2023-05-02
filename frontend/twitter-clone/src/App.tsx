import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";

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
					<Route path="/" element={<AuthLayout />}>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
