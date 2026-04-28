import { useAnecdotes } from "../hooks/useAnecdotes";
import useNotification from "../hooks/useNotify";

const AnecdoteForm = () => {
	const { addAnecdote: AddAnecdoteToServer } = useAnecdotes();
	const { createNotification } = useNotification();

	const onCreate = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		event.target.reset();
		createNotification(`Created ${content}`, "success");
		AddAnecdoteToServer(content);
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
