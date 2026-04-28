import { useAnecdoteActions } from "./anecdoteStore";
import { useNotificationActions } from "./notificationStore";

const AnecdoteForm = () => {
	const { add } = useAnecdoteActions();
	const { setNotification } = useNotificationActions();

	const addAnectode = (e) => {
		e.preventDefault();
		const anecdote = e.target.anecdote.value;
		add(anecdote);
		setNotification(`You created ${anecdote}`, "success");
		e.target.reset();
	};

	return (
		<div>
			<h3>Add new</h3>
			<form onSubmit={addAnectode}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
