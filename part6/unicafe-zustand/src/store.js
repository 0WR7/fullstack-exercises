import { create } from 'zustand'

const useUnicafeStore = create((set) => ({
    feedback: {
        good: 0,
        neutral: 0,
        bad: 0,
    },
    //maybe refactor into a function that takes each feedback as arguement
    actions: {
        addGood: () =>
            set((state) => ({
                feedback: { ...state.feedback, good: state.feedback.good + 1 },
            })),
        addNeutral: () =>
            set((state) => ({
                feedback: {
                    ...state.feedback,
                    neutral: state.feedback.neutral + 1,
                },
            })),
        addBad: () =>
            set((state) => ({
                feedback: {
                    ...state.feedback,
                    bad: state.feedback.bad + 1,
                },
            })),
    },
}))

export const useFeedback = () => useUnicafeStore((state) => state.feedback)
export const useFeedbackActions = () =>
    useUnicafeStore((state) => state.actions)
