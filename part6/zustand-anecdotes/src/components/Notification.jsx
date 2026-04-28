import { useNotification } from "./notificationStore";

const Notification = () => {
	const { message, type } = useNotification();

	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
		marginBottom: 10,
		borderColor: type === "success" ? "green" : "red",
	};

	if (!message) return null;

	return <div style={style}>{message}</div>;
};
export default Notification;
