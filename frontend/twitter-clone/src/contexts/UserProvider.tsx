import { createContext, useContext, useState } from "react";

type User = {
	id: string;
	username: string;
	email: string;
	icon: string;
	version: number;
};

type UserContextValue = {
	user?: User;
	setUser: (user?: User) => void;
	logoutEvent: boolean;
	triggerLogoutEvent: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserContext must be used with a UserProvider");
	}

	return context;
};

type UserProviderProps = {
	children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [logoutEvent, setLogoutEvent] = useState<boolean>(false);

	const triggerLogoutEvent = () => {
		setLogoutEvent(true);
		setTimeout(() => setLogoutEvent(false), 3000);
	};

	return (
		<UserContext.Provider
			value={{ user, setUser, logoutEvent, triggerLogoutEvent }}
		>
			{children}
		</UserContext.Provider>
	);
};
