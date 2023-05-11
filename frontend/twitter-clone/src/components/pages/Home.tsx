import { Box, CircularProgress } from "@mui/material";
import TweetBox from "./TweetBox";
import TweetList from "./TweetList";
import { useEffect, useState } from "react";
import { useTweetContext } from "../../contexts/TweetProvider";

const Home = () => {
	const { tweets } = useTweetContext();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(false);
	}, [tweets]);

	return (
		<Box sx={{ height: "100vh", margin: "10px 10px 0", maxWidth: 500 }}>
			{loading ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
					}}
				>
					<CircularProgress />
				</Box>
			) : (
				<>
					<TweetBox title={"ホーム"} rows={undefined} onClose={() => {}} />
					<TweetList tweets={tweets} />
				</>
			)}
		</Box>
	);
};

export default Home;
