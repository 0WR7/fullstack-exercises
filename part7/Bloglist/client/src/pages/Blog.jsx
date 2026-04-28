import { Button, Link as MuiLink, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const canRemove = blog?.user?.username === user?.username

    return (
        <Paper className="blog blog-card">
            <Stack spacing={1.25}>
                <div className="blog-card-header">
                    <Typography
                        component="h2"
                        className="blog-title"
                    >
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
                        <Typography
                            component="h3"
                            className="blog-author"
                        >
                            {blog.author}
                        </Typography>
                        <div className="blog-meta-row">
                            <Typography
                                component="p"
                                className="blog-url"
                            >
                                url:{' '}
                                <MuiLink
                                    href={blog.url}
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
                                    onClick={() => likeBlog(blog)}
                                    className="blog-action-button blog-action-button-accent"
                                >
                                    like
                                </Button>
                            )}
                        </div>
                        <Typography
                            className="likes"
                            variant="body2"
                        >
                            likes {blog.likes}
                        </Typography>
                        <Typography variant="body2" className="blog-user">
                            {blog?.user?.name}
                        </Typography>
                        {canRemove && (
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => deleteBlog(blog.id)}
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
