import { useAnecdoteActions } from "./anecdoteStore";

const AnecdoteFilter = () => {
	const { setFilter } = useAnecdoteActions();

	return (
		<div>
			<label htmlFor="filter">filter</label>
			<input
				type="text"
				name="filter"
				onChange={(e) => setFilter(e.target.value)}
			/>
		</div>
	);
};

export default AnecdoteFilter;
