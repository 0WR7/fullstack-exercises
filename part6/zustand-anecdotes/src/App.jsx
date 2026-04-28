import { useEffect } from "react";
import AnecdoteFilter from "./components/AnecdoteFilter";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import { useAnecdoteActions } from "./components/anecdoteStore";
import Notification from "./components/Notification";

const App = () => {
	const { initialize } = useAnecdoteActions();

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<div>
			<h2>Anecdotes</h2>
			<Notification />
			<AnecdoteFilter />
			<AnecdoteList />
			<AnecdoteForm />
		</div>
	);
};

export default App;
