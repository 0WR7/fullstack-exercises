import { Alert } from '@mui/material'
import { useNotification } from '../stores/notificationStore'

const Notification = () => {
    const { message, severity} = useNotification()

    if (!message) {
        return null
    }

    return (
        <Alert severity={severity} className="notification">
            {message}
        </Alert>
    )
}

export default Notification
