import { Box } from "@mui/material";
import TweetBox from "./TweetBox";
import TweetList from "./TweetList";

const Home = () => {
	return (
		<Box sx={{ height: "100vh", margin: "10px 10px 0", maxWidth: 500 }}>
			<TweetBox />
			<TweetList />
		</Box>
	);
};

export default Home;
