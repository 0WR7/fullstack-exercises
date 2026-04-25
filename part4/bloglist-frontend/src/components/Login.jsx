import { Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const Login = ({ loginHandler }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (event) => {
        event.preventDefault()
        loginHandler(username, password)
        setUsername('')
        setPassword('')
    }

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={0}
                sx={{
                    mt: 3,
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        Login to application
                    </Typography>
                    <Stack component="form" spacing={2} onSubmit={handleLogin} noValidate autoComplete="off">
                        <TextField
                            id="username"
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            size="small"
                        />
                        <Button variant="contained" type="submit" size="small" sx={{ alignSelf: 'flex-start', px: 2 }}>
                            login
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    )
}

export default Login
