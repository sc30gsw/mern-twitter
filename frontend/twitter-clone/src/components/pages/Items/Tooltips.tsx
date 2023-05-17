import { IconButton, Tooltip } from "@mui/material";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import tweetApi from "../../../api/tweetApi";
import { useTweetContext } from "../../../contexts/TweetProvider";
import { useEffect, useState } from "react";
import { useUserContext } from "../../../contexts/UserProvider";

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
	const [count, setCount] = useState<number>(0);

	const handleRetweet = async () => {
		try {
			if (
				retweetUsers.length > 0 &&
				retweetUsers.includes(user?._id as string)
			) {
				await tweetApi.deleteRetweet(tweetId, originalTweetId);
				console.log("リツイートを削除しました");
			} else if (!retweetUsers.includes(user?._id as string)) {
				await tweetApi.createRetweet({
					userId,
					tweetId: originalTweetId ? originalTweetId : tweetId,
				});
				console.log("リツートに成功しました");
			} else {
				alert("リツイート済みツイート");
			}

			const retweetCount = await tweetApi.countRetweet(
				originalTweetId ? originalTweetId : tweetId
			);

			console.log(retweetCount);

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
			<Tooltip title="Retweet">
				<IconButton
					sx={{
						color: retweetUsers.includes(user?._id as string)
							? "rgb(0, 186, 124)"
							: color,
					}}
					onClick={handleRetweet}
				>
					<RepeatOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Like">
				<IconButton sx={{ color: color }}>
					<FavoriteBorderOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
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
