import { IconButton, Tooltip } from "@mui/material";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import tweetApi from "../../../api/tweetApi";
import { useTweetContext } from "../../../contexts/TweetProvider";
import { useEffect, useState } from "react";

type TooltipsProps = {
	userId: string;
	tweetId: string;
	originalTweetId: string;
	fontSize: string;
	color: string;
	isRetweet: boolean;
};

const Tooltips = ({
	userId,
	tweetId,
	originalTweetId,
	fontSize,
	color,
	isRetweet,
}: TooltipsProps) => {
	const { setTweets } = useTweetContext();

	const handleRetweet = async () => {
		try {
			if (isRetweet) {
				await tweetApi.deleteRetweet(tweetId);
				console.log("リツイートを削除しました");
			} else {
				await tweetApi.createRetweet({
					userId,
					tweetId: originalTweetId ? originalTweetId : tweetId,
				});
				console.log("リツートに成功しました");
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
			<Tooltip title="Retweet">
				<IconButton
					sx={{ color: isRetweet ? "rgb(0, 186, 124)" : color }}
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
