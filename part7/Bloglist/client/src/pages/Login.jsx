import {
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useField from '../hooks/useField'
import { useNotificationActions } from '../stores/notificationStore'
import { useUserActions } from '../stores/userStore'

const Login = () => {
    const username = useField('text')
    const password = useField('password')
    const { login } = useUserActions()
    const { setNotification } = useNotificationActions()
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        try {
            event.preventDefault()
            await login({
                username: username.value,
                password: password.value,
            })
            navigate('/')
        } catch (_error) {
            setNotification('Login failed, wrong username / password', 'error')
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={0} className="form-panel form-panel-spaced">
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        Login to application
                    </Typography>
                    <Stack
                        component="form"
                        spacing={2}
                        onSubmit={handleLogin}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="username"
                            label="Username"
                            {...username}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            id="password"
                            label="Password"
                            {...password}
                            fullWidth
                            size="small"
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            size="small"
                            className="form-submit"
                        >
                            login
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    )
}

export default Login
