import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useAnecdotes } from "./hooks/useAnecdotes";
import useNotification from "./hooks/useNotify";

const App = () => {
	const { anecdotes, isError, isPending, updateAnecdote } = useAnecdotes();
	const { createNotification } = useNotification();

	const handleVote = (anecdote) => {
		updateAnecdote(anecdote);
		createNotification(`Voted ${anecdote.content}`, "success");
	};

	if (isError || isPending) {
		return <div>failed to fetch</div>;
	}

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification />
			<AnecdoteForm />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
