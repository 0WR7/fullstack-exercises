import {
    Box,
    Button,
    Link as MuiLink,
    Paper,
    Stack,
    Typography,
} from '@mui/material'
import { useState } from 'react'

const blogCardSx = {
    width: 'min(100%, 720px)',
    mx: 'auto',
    my: 1.25,
    px: { xs: 1.5, sm: 2 },
    py: 1.5,
    border: '1px solid',
    borderColor: '#dbeafe',
    borderRadius: 1.5,
    bgcolor: 'rgba(248, 252, 255, 0.92)',
    boxShadow: 'none',
}

const actionButtonSx = {
    minWidth: 0,
    px: 1,
    py: 0.3,
    fontSize: '0.8125rem',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: 1.5,
}

const quietButtonSx = {
    ...actionButtonSx,
    color: 'text.secondary',
    '&:hover': {
        bgcolor: '#eff6ff',
        color: '#0369a1',
    },
}

const accentButtonSx = {
    ...actionButtonSx,
    px: 1.1,
    color: '#0369a1',
    borderColor: '#bae6fd',
    bgcolor: '#f0f9ff',
    '&:hover': {
        borderColor: '#7dd3fc',
        bgcolor: '#e0f2fe',
    },
}

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const canRemove = blog?.user?.username === user?.username

    return (
        <Paper className="blog" sx={blogCardSx}>
            <Stack spacing={1.25}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    <Typography
                        component="h2"
                        sx={{
                            flexGrow: 1,
                            color: 'text.primary',
                            fontSize: '1rem',
                            fontWeight: 600,
                            letterSpacing: 0,
                            lineHeight: 1.3,
                        }}
                    >
                        {blog.title} {blog.author}
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        onClick={toggleVisibility}
                        sx={quietButtonSx}
                    >
                        {visible ? 'hide' : 'view'}
                    </Button>
                </Box>

                {visible && (
                    <>
                        <Typography
                            component="h3"
                            sx={{
                                color: '#0369a1',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                letterSpacing: 0,
                                lineHeight: 1.2,
                            }}
                        >
                            {blog.author}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 1,
                                flexWrap: 'wrap',
                            }}
                        >
                            <Typography
                                component="p"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.2,
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                url:{' '}
                                <MuiLink
                                    href={blog.url}
                                    underline="hover"
                                    sx={{
                                        color: '#0369a1',
                                        overflowWrap: 'anywhere',
                                    }}
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
                                    sx={accentButtonSx}
                                >
                                    like
                                </Button>
                            )}
                        </Box>
                        <Typography
                            className="likes"
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >
                            likes {blog.likes}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >
                            {blog?.user?.name}
                        </Typography>
                        {canRemove && (
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => deleteBlog(blog.id)}
                                sx={quietButtonSx}
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
