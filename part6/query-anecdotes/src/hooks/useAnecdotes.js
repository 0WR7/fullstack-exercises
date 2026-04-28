import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAnecdote, getAnecdotes, updateAnecdote } from "../requests";
import useNotification from "./useNotify";

export const useAnecdotes = () => {
	const queryClient = useQueryClient();
	const ANECDOTES_KEY = ["anecdotes"];
	const { createNotification } = useNotification();

	const result = useQuery({
		queryKey: ANECDOTES_KEY,
		queryFn: getAnecdotes,
		retry: false,
	});

	const newAnecdoteMutation = useMutation({
		mutationFn: createAnecdote,
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData(ANECDOTES_KEY);
			queryClient.setQueryData(ANECDOTES_KEY, anecdotes.concat(newAnecdote));
		},
		onError: (error) => {
			createNotification(error?.message || "failed to create", "error");
		},
	});

	const updateAnecdoteMutation = useMutation({
		mutationFn: updateAnecdote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ANECDOTES_KEY });
		},
	});
	return {
		anecdotes: result.data,
		isPending: result.isPending,
		isError: result.isError,
		addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
		updateAnecdote: (anecdote) =>
			updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
	};
};
