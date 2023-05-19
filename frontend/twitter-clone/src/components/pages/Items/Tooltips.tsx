import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import tweetApi from "../../../api/tweetApi";
import { useTweetContext } from "../../../contexts/TweetProvider";
import { useEffect, useState } from "react";
import { useUserContext } from "../../../contexts/UserProvider";
import { useNavigate } from "react-router-dom";

type TooltipsProps = {
	userId: string;
	tweetId: string;
	originalTweetId: string;
	fontSize: string;
	color: string;
	retweetUsers: string[];
};

const Tooltips = ({
	userId,
	tweetId,
	originalTweetId,
	fontSize,
	color,
	retweetUsers,
}: TooltipsProps) => {
	const { user } = useUserContext();
	const { setTweets } = useTweetContext();
	const navigate = useNavigate();

	const [viewCount, setViewCount] = useState<number>(0);
	const [hover, setHover] = useState<boolean>(false);
	const [viewHover, setViewHover] = useState<boolean>(false);

	useEffect(() => {
		const getViewCount = async () => {
			const res = await tweetApi.getViewCount(
				originalTweetId ? originalTweetId : tweetId
			);
			setViewCount(res.data.viewCount);
			const tweets = await tweetApi.search();
			setTweets(tweets.data);
		};
		getViewCount();
	}, [tweetId, originalTweetId, setTweets]);

	const handleRetweet = async () => {
		try {
			if (
				retweetUsers.length > 0 &&
				retweetUsers.includes(user?._id as string) &&
				userId === user?._id &&
				originalTweetId
			) {
				await tweetApi.deleteRetweet(tweetId, originalTweetId);
				console.log("リツイートを削除しました");
				navigate("/");
			} else if (!retweetUsers.includes(user?._id as string)) {
				await tweetApi.createRetweet({
					userId,
					tweetId: tweetId,
					originalTweetId: originalTweetId ? originalTweetId : undefined,
				});
				console.log("リツートに成功しました");
			} else {
				alert("自分の投稿からリツイートした投稿を削除してください");
			}

			const res = await tweetApi.search();
			setTweets(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Tooltip title="Reply">
				<IconButton sx={{ color: color }}>
					<ModeCommentOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip
				title={
					retweetUsers.includes(user?._id as string)
						? "Undo Retweet"
						: "Retweet"
				}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					<IconButton
						sx={{
							color:
								hover || retweetUsers.includes(user?._id as string)
									? "rgb(0, 186, 124)"
									: color,
							background: hover ? "rgba(151, 199, 183, 0.472)" : "",
							":hover": {
								background: "rgba(151, 199, 183, 0.472)",
							},
						}}
						onClick={handleRetweet}
					>
						<RepeatOutlinedIcon sx={{ fontSize: fontSize }} />
					</IconButton>
					<Typography
						sx={{
							color:
								hover || retweetUsers.includes(user?._id as string)
									? "rgb(0, 186, 124)"
									: "#898989",
							":hover": {
								cursor: "pointer",
							},
						}}
					>
						{retweetUsers.length > 0 && retweetUsers.length}
					</Typography>
				</Box>
			</Tooltip>
			<Tooltip title="Like">
				<IconButton sx={{ color: color }}>
					<FavoriteBorderOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="View">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
					onMouseEnter={() => setViewHover(true)}
					onMouseLeave={() => setViewHover(false)}
				>
					<IconButton
						sx={{
							color: viewHover ? "#1DA1F2" : color,
							background: viewHover ? "#1da0f272" : "",
							":hover": {
								background: "#1da0f272",
							},
						}}
					>
						<BarChartOutlinedIcon sx={{ fontSize: fontSize }} />
					</IconButton>
					<Typography
						sx={{
							color: viewHover ? "#1DA1F2" : "#898989",
							":hover": {
								cursor: "pointer",
							},
						}}
					>
						{viewCount > 0 && viewCount}
					</Typography>
				</Box>
			</Tooltip>
			<Tooltip title="Share">
				<IconButton sx={{ color: color }}>
					<IosShareOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
		</>
	);
};

export default Tooltips;
