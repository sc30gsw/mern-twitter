import { createContext, useContext, useEffect, useState } from "react";

type User = {
	_id: string;
	profileName: string;
	username: string;
	email: string;
	icon: string;
	profileImg: string;
	description: string;
	following: string[];
	followers: string[];
	__v: number;
};

type UserContextValue = {
	user?: User;
	setUser: (user?: User) => void;
	logoutEvent: boolean;
	triggerLogoutEvent: () => void;
	settingPasswordEvent: boolean;
	triggerSettingPasswordEvent: () => void;
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
	const [user, _setUser] = useState<User | undefined>(undefined);
	const [logoutEvent, setLogoutEvent] = useState<boolean>(false);
	const [settingPasswordEvent, setSettingPasswordEvent] =
		useState<boolean>(false);

	// ユーザー情報をローカルストレージに保存する関数
	const setUser = (user?: User) => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
		_setUser(user);
	};

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) _setUser(JSON.parse(storedUser));
	}, []);

	const triggerLogoutEvent = () => {
		setLogoutEvent(true);
		setTimeout(() => setLogoutEvent(false), 3000);
	};

	const triggerSettingPasswordEvent = () => {
		setSettingPasswordEvent(true);
		setTimeout(() => setSettingPasswordEvent(false), 3000);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				logoutEvent,
				triggerLogoutEvent,
				settingPasswordEvent,
				triggerSettingPasswordEvent,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
