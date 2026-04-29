import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useUser, useUserActions } from '../stores/userStore'

const AppHeader = () => {
    const { user } = useUser()
    const { logout } = useUserActions()

    const navigate = useNavigate()

    const onLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <AppBar position="sticky" elevation={0} className="app-bar">
            <Container maxWidth="lg" disableGutters>
                <Toolbar disableGutters className="app-toolbar">
                    <Typography
                        component={Link}
                        to="/"
                        variant="subtitle1"
                        className="app-title"
                    >
                        bloglist
                    </Typography>
                    <div className="app-nav">
                        <Button
                            component={Link}
                            to="/"
                            variant="text"
                            size="small"
                            className="nav-button"
                        >
                            Blogs
                        </Button>
                        <Button
                            component={Link}
                            to="/users"
                            variant="text"
                            size="small"
                            className="nav-button"
                        >
                            Users
                        </Button>
                        {user && (
                            <Button
                                component={Link}
                                to="/create"
                                variant="outlined"
                                size="small"
                                className="nav-button nav-button-accent"
                            >
                                new blog
                            </Button>
                        )}
                    </div>
                    <div className="toolbar-spacer" />
                    <div className="session-actions">
                        {user && (
                            <Typography
                                variant="body2"
                                className="session-user"
                            >
                                {user.name}
                            </Typography>
                        )}
                        {!user ? (
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                size="small"
                                className="nav-button nav-button-accent"
                            >
                                login
                            </Button>
                        ) : (
                            <Button
                                variant="text"
                                size="small"
                                onClick={onLogout}
                                className="nav-button"
                            >
                                logout
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default AppHeader
