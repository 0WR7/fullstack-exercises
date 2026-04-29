import { useEffect } from 'react'
import {
    Container,
    Link as MuiLink,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useBlogActions, useBlogs } from '../stores/blogStore'

const BlogsList = () => {
    const { blogs } = useBlogs()
    const { initialize } = useBlogActions()

    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <Container maxWidth="md" className="page-container">
            <Paper elevation={0} className="page-panel">
                <Typography variant="h5" component="h1" className="page-title">
                    Blogs
                </Typography>
                <List disablePadding className="content-list">
                    {blogs.map((blog) => (
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
            </Paper>
        </Container>
    )
}

export default BlogsList
