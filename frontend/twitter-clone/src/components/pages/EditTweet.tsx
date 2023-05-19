import React, { useEffect, useState } from "react";
import Home from "./Home";
import EditTweetBoxDialog from "./dialog/EditTweetBoxDialog";
import { useEditTweetBoxDialogContext } from "../../contexts/TweetBoxDialogProvider";
import { useNavigate, useParams } from "react-router-dom";
import { Tweet } from "../../types/Tweet";
import tweetApi from "../../api/tweetApi";
import { useUserContext } from "../../contexts/UserProvider";

const EditTweet = () => {
	const { user } = useUserContext();
	const { editOpenDialog, setEditOpenDialog } = useEditTweetBoxDialogContext();

	const navigate = useNavigate();
	const { tweetId } = useParams();
	const [tweet, setTweet] = useState<Tweet>();

	useEffect(() => {
		setEditOpenDialog(true);
		const getTweet = async () => {
			try {
				const res = await tweetApi.getTweet(tweetId as string);
				console.log("ツイート詳細を取得しました");
				setTweet(res.data[0]);
				if (res.data[0].userId !== user?._id) {
					setEditOpenDialog(false);
					navigate("/");
				}
			} catch (err) {
				console.log(err);
			}
		};

		getTweet();
	}, [setEditOpenDialog, tweetId, navigate, user?._id]);

	return (
		<>
			<Home />
			{tweet && (
				<EditTweetBoxDialog open={editOpenDialog} tweet={tweet as Tweet} />
			)}
		</>
	);
};

export default EditTweet;
