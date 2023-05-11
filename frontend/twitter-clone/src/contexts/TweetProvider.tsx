import React, { createContext, useContext, useState, useEffect } from "react";
import tweetApi from "../api/tweetApi";
import { Tweet } from "../types/Tweet";

type TweetContextType = {
	tweets: Tweet[];
	setTweets: (tweets: Tweet[]) => void;
};

const TweetContext = createContext<TweetContextType | undefined>(undefined);

export const useTweetContext = () => {
	const context = useContext(TweetContext);
	if (!context) {
		throw new Error("useTweetContext must be used within a TweetProvider");
	}
	return context;
};

type TweetProviderProps = {
	children: React.ReactNode;
};

export const TweetProvider = ({ children }: TweetProviderProps) => {
	const [tweets, setTweets] = useState<Tweet[]>([]);

	useEffect(() => {
		const getTweets = async () => {
			try {
				const res = await tweetApi.search();
				setTweets(res.data);
			} catch (err: any) {
				const errors = err.data.errors;
				console.log(errors);
			}
		};
		getTweets();
	}, []);

	return (
		<TweetContext.Provider value={{ tweets, setTweets }}>
			{children}
		</TweetContext.Provider>
	);
};
