const normalizeErrorMessage = (error) => {
    const rawError = error?.response?.data

    if (typeof rawError === 'string') return rawError
    if (rawError?.message) return rawError.message
    if (rawError?.error) return rawError.error

    return 'something went wrong'
}

export default normalizeErrorMessage
