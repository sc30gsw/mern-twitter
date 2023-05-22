import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./contexts/UserProvider";
import { TweetProvider } from "./contexts/TweetProvider";
import { TweetBoxDialogProvider } from "./contexts/TweetBoxDialogProvider";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<UserProvider>
			<TweetProvider>
				<TweetBoxDialogProvider>
					<App />
				</TweetBoxDialogProvider>
			</TweetProvider>
		</UserProvider>
	</React.StrictMode>
);
