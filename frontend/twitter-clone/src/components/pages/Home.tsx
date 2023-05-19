import { Box, CircularProgress, Typography } from "@mui/material";
import TweetBox from "./TweetBox";
import TweetList from "./TweetList";
import { useEffect, useState } from "react";
import { useTweetContext } from "../../contexts/TweetProvider";
import tweetApi from "../../api/tweetApi";
import { useTweetBoxDialogContext } from "../../contexts/TweetBoxDialogProvider";

const Home = () => {
	const { tweets, setTweets } = useTweetContext();
	const [loading, setLoading] = useState<boolean>(true);
	const { openDialog } = useTweetBoxDialogContext();

	useEffect(() => {
		const getTweets = async () => {
			try {
				const res = await tweetApi.search();
				setTweets(res.data);
				setLoading(false);
			} catch (err: any) {
				const errors = err.data.errors;
				console.log(errors);
				setLoading(false);
			}
		};
		getTweets();
	}, [setTweets]);

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
					<Typography variant="h5">ホーム</Typography>
					{openDialog || <TweetBox rows={undefined} onClose={() => {}} />}
					<TweetList tweets={tweets} />
				</>
			)}
		</Box>
	);
};

export default Home;
