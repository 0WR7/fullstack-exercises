import { createContext, useState } from "react";

const NotificationContext = createContext();

export default NotificationContext;

export const NotificationContextProvider = (props) => {
	const [notification, setNotification] = useState(null);

	const createNotification = (content, type) => {
		setTimeout(() => {
			setNotification(null);
		}, 5000);

		setNotification({ message: content, type });
	};

	return (
		<NotificationContext.Provider value={{ notification, createNotification }}>
			{props.children}
		</NotificationContext.Provider>
	);
};
