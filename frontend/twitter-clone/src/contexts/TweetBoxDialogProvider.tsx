import React, { createContext, useContext, useState } from "react";

type TweetBoxDialogContextType = {
	openDialog: boolean;
	setOpenDialog: (openDialog: boolean) => void;
};

const TweetBoxDialog = createContext<TweetBoxDialogContextType | undefined>(
	undefined
);

type EditTweetBoxDialogContextType = {
	editOpenDialog: boolean;
	setEditOpenDialog: (editOpenDialog: boolean) => void;
};

const EditTweetBoxDialog = createContext<
	EditTweetBoxDialogContextType | undefined
>(undefined);

export const useTweetBoxDialogContext = () => {
	const context = useContext(TweetBoxDialog);
	if (!context) {
		throw new Error("useTweetContext must be used within a TweetProvider");
	}
	return context;
};

export const useEditTweetBoxDialogContext = () => {
	const context = useContext(EditTweetBoxDialog);
	if (!context) {
		throw new Error("useEditTweetContext must be used within a TweetProvider");
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
	const [editOpenDialog, setEditOpenDialog] = useState<boolean>(false);

	return (
		<TweetBoxDialog.Provider value={{ openDialog, setOpenDialog }}>
			<EditTweetBoxDialog.Provider
				value={{ editOpenDialog, setEditOpenDialog }}
			>
				{children}
			</EditTweetBoxDialog.Provider>
		</TweetBoxDialog.Provider>
	);
};
