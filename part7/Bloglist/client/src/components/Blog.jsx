import {
    Button,
    Link as MuiLink,
    Paper,
    Stack,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import normalizeErrorMessage from '../helpers/errorHandling'
import { useBlogActions } from '../stores/blogStore'
import { useNotificationActions } from '../stores/notificationStore'
import { useUser } from '../stores/userStore'

const Blog = ({ blog }) => {
    const [visible, setVisible] = useState(false)
    const { deleteBlog, update } = useBlogActions()
    const { setNotification } = useNotificationActions()
    const { user } = useUser()
    const blogUrl = /^https?:\/\//i.test(blog.url)
        ? blog.url
        : `https://${blog.url}`

    const toggleVisibility = () => {
        setVisible(!visible)
    }
    const canRemove = blog?.user?.username === user?.username
    const navigate = useNavigate()

    const handleDelete = async (blogId) => {
        if (!window.confirm('are you sure you want to delete')) {
            return
        }
        try {
            await deleteBlog(blogId)
            navigate('/')
        } catch (error) {
            setNotification(normalizeErrorMessage(error), 'error')
        }
    }

    const handleLike = async (blogToLike) => {
        try {
            await update(blogToLike)
        } catch (error) {
            setNotification(normalizeErrorMessage(error), 'error')
        }
    }

    return (
        <Paper className="blog blog-card">
            <Stack spacing={1.25}>
                <div className="blog-card-header">
                    <Typography component="h2" className="blog-title">
                        {blog.title} {blog.author}
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        onClick={toggleVisibility}
                        className="blog-action-button blog-action-button-quiet"
                    >
                        {visible ? 'hide' : 'view'}
                    </Button>
                </div>

                {visible && (
                    <>
                        <Typography component="h3" className="blog-author">
                            {blog.author}
                        </Typography>
                        <div className="blog-meta-row">
                            <Typography component="p" className="blog-url">
                                url:{' '}
                                <MuiLink
                                    href={blogUrl}
                                    underline="hover"
                                    className="blog-link"
                                >
                                    {blog.url}
                                </MuiLink>
                            </Typography>
                            {user && (
                                <Button
                                    aria-label="like"
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleLike(blog)}
                                    className="blog-action-button blog-action-button-accent"
                                >
                                    like
                                </Button>
                            )}
                        </div>
                        <Typography className="likes" variant="body2">
                            likes {blog.likes}
                        </Typography>
                        <Typography variant="body2" className="blog-user">
                            {blog?.user?.name}
                        </Typography>
                        {canRemove && (
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleDelete(blog.id)}
                                className="blog-action-button blog-action-button-quiet"
                            >
                                remove
                            </Button>
                        )}
                    </>
                )}
            </Stack>
        </Paper>
    )
}

export default Blog
