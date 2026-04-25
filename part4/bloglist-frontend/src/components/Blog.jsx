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
    width: 'min(100%, 632px)',
    mx: 'auto',
    my: 2,
    px: { xs: 3, sm: 5 },
    py: { xs: 2.5, sm: 1.25 },
    border: 0,
    borderRadius: 4,
    bgcolor: '#d9d9d9',
    boxShadow: 'none',
}

const actionButtonSx = {
    minWidth: 0,
    px: 4,
    py: 0.5,
    fontSize: '1.5rem',
    fontWeight: 400,
    textTransform: 'none',
    borderRadius: 999,
}

const quietButtonSx = {
    ...actionButtonSx,
    px: 1,
    py: 0.25,
    fontSize: '0.8125rem',
    color: '#111111',
    '&:hover': {
        bgcolor: 'rgba(255, 255, 255, 0.5)',
    },
}

const accentButtonSx = {
    ...actionButtonSx,
    color: '#111111',
    bgcolor: '#ffffff',
    borderColor: '#ffffff',
    '&:hover': {
        borderColor: '#ffffff',
        bgcolor: '#f8fafc',
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
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    <Typography
                        component="h2"
                        sx={{
                            flexGrow: 1,
                            color: '#000000',
                            fontSize: { xs: '2rem', sm: '3.5rem' },
                            fontWeight: 700,
                            letterSpacing: 0,
                            lineHeight: 1,
                            textAlign: 'center',
                        }}
                    >
                        {blog.title}
                        {!visible && ` ${blog.author}`}
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
                                color: '#000000',
                                fontSize: { xs: '1.6rem', sm: '2.75rem' },
                                fontWeight: 700,
                                letterSpacing: 0,
                                lineHeight: 1,
                                textAlign: 'center',
                            }}
                        >
                            {blog.author}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: { xs: 1.5, sm: 4 },
                                mt: 0.5,
                            }}
                        >
                            <Typography
                                component="p"
                                sx={{
                                    color: '#111111',
                                    fontSize: { xs: '1.2rem', sm: '1.75rem' },
                                    lineHeight: 1.2,
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                url:{' '}
                                <MuiLink
                                    href={blog.url}
                                    underline="none"
                                    sx={{
                                        color: 'inherit',
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
                                    size="medium"
                                    onClick={() => likeBlog(blog)}
                                    sx={accentButtonSx}
                                >
                                    Like
                                </Button>
                            )}
                        </Box>
                        <Typography
                            className="likes"
                            variant="body2"
                            sx={{ color: '#111111', textAlign: 'center' }}
                        >
                            likes {blog.likes}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#111111', textAlign: 'center' }}
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
