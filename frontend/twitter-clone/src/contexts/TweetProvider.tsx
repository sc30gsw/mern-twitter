import React, { createContext, useContext, useState } from "react";
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

	return (
		<TweetContext.Provider value={{ tweets, setTweets }}>
			{children}
		</TweetContext.Provider>
	);
};
