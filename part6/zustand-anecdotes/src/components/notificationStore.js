import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
	message: null,
	type: null,
	timer: null,
	actions: {
		setNotification: (message, type) => {
			const currentTimer = get().timer;

			if (currentTimer) clearTimeout(currentTimer);

			const newTimer = setTimeout(() => {
				set({ message: null, timer: null });
			}, 5000);

			set({ message, type, timer: newTimer });
		},
	},
}));

export const useNotification = () => {
	const message = useNotificationStore((state) => state.message);
	const type = useNotificationStore((state) => state.type);

	return { message, type };
};

export const useNotificationActions = () => {
	return useNotificationStore((state) => state.actions);
};
