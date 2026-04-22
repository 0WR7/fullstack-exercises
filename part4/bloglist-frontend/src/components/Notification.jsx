const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 15,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    const successStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 15,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return (
        <div className="notification">
            <p style={type === 'success' ? successStyle : errorStyle}>
                {message}
            </p>
        </div>
    )
}

export default Notification
