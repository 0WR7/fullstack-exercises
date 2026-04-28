import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
	const [anecdotes, setAnecdotes] = useState([]);

	useEffect(() => {
		anecdoteService.getAll().then((data) => setAnecdotes(data));
	}, []);

	const addAnecdote = async (newAnecdote) => {
		const returnedAnecdote = await anecdoteService.createNew(newAnecdote);
		setAnecdotes((prev) => prev.concat(returnedAnecdote));
	};

	const deleteAnecdote = async (id) => {
		await anecdoteService.deleteOne(id);
		setAnecdotes((prev) => prev.filter((a) => a.id !== id));
	};

	return {
		anecdotes,
		addAnecdote,
		deleteAnecdote,
	};
};
