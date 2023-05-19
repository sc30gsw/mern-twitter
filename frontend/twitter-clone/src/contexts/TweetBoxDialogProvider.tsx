import React, { createContext, useContext, useState } from "react";
import { Tweet } from "../types/Tweet";

type TweetBoxDialogContextType = {
	openDialog: boolean;
	setOpenDialog: (openDialog: boolean) => void;
};

const TweetBoxDialog = createContext<TweetBoxDialogContextType | undefined>(
	undefined
);

export const useTweetBoxDialogContext = () => {
	const context = useContext(TweetBoxDialog);
	if (!context) {
		throw new Error("useTweetContext must be used within a TweetProvider");
	}
	return context;
};

type TweetBoxDialogProviderProps = {
	children: React.ReactNode;
};

export const TweetBoxDialogProvider = ({
	children,
}: TweetBoxDialogProviderProps) => {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	return (
		<TweetBoxDialog.Provider value={{ openDialog, setOpenDialog }}>
			{children}
		</TweetBoxDialog.Provider>
	);
};
