import { useEffect } from 'react'
import {
    Container,
    Link as MuiLink,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useUsers, useUsersActions } from '../stores/usersStore'

const UserPage = () => {
    const { id } = useParams()
    const { users, initialized } = useUsers()
    const { initialize } = useUsersActions()

    useEffect(() => {
        initialize()
    }, [initialize])

    const user = users.find((currentUser) => currentUser.id === id)

    if (!initialized) {
        return null
    }

    if (!user) {
        return (
            <Container maxWidth="md" className="page-container">
                <Paper elevation={0} className="page-panel">
                    <Typography variant="h5" component="h1">
                        404 not found
                    </Typography>
                </Paper>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" className="page-container">
            <Paper elevation={0} className="page-panel">
                <Stack spacing={2}>
                    <div>
                        <Typography
                            variant="h5"
                            component="h1"
                            className="page-title"
                        >
                            {user.name}
                        </Typography>
                        <Typography variant="body2" className="page-subtitle">
                            {user.blogs.length} added blogs
                        </Typography>
                    </div>
                    <div>
                        <Typography
                            variant="h6"
                            component="h2"
                            className="section-title"
                        >
                            Added blogs
                        </Typography>
                        <List disablePadding className="content-list">
                            {user.blogs.map((blog) => (
                                <ListItem
                                    key={blog.id}
                                    disableGutters
                                    className="content-list-item"
                                >
                                    <ListItemText
                                        primary={
                                            <MuiLink
                                                component={Link}
                                                to={`/blogs/${blog.id}`}
                                                underline="hover"
                                                className="content-link"
                                            >
                                                {blog.title}
                                            </MuiLink>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Stack>
            </Paper>
        </Container>
    )
}

export default UserPage
