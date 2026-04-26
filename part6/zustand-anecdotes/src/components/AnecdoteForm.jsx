import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
	const { add } = useAnecdoteActions();

	const addAnectode = (e) => {
		e.preventDefault();
		add(e.target.anecdote.value);
		e.reset();
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
