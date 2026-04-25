import {
    AppBar,
    Box,
    Button,
    Container,
    Toolbar,
    Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Blogs from './components/BlogList'
import Login from './components/Login'
import Notification from './components/Notification'
import normalizeErrorMessage from './helpers/errorHandling'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notification, setNotification] = useState(null)
    const [user, setUser] = useState(null)
    const notificationTimeoutRef = useRef(null)

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const navigate = useNavigate()

    const handleLogin = async (username, password) => {
        try {
            const user = await loginService.login({ username, password })

            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            navigate('/')
        } catch {
            notificationSetter('Wrong username or password', 'error')
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        setUser(null)
        blogService.setToken(null)
        window.localStorage.removeItem('loggedBlogappUser')
        navigate('/')
    }

    //links to BlogForm
    const createBlog = async (blogObject) => {
        try {
            const returnedBlog = await blogService.create(blogObject)
            const createdBlog = { ...returnedBlog, user }
            setBlogs((prevBlogs) => prevBlogs.concat(createdBlog))
            //routing
            navigate('/')
            const message = `A new blog ${createdBlog.title} by ${createdBlog.author} was added`
            notificationSetter(message, 'success')
        } catch (error) {
            notificationSetter(normalizeErrorMessage(error), 'error')
        }
    }

    const updateBlog = async (blogObject) => {
        try {
            const blogToUpdate = {
                ...blogObject,
                likes: blogObject.likes + 1,
            }

            const returnedBlog = await blogService.update(blogToUpdate)
            console.log(returnedBlog)
            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog.id === returnedBlog.id ? returnedBlog : blog
                )
            )
        } catch (error) {
            notificationSetter(normalizeErrorMessage(error), 'error')
        }
    }

    const deleteBlog = async (blogId) => {
        if (!window.confirm('are you sure you want to delete?')) {
            return
        }
        try {
            await blogService.deleteBlog(blogId)
            setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blogId))
            navigate('/')
        } catch (error) {
            notificationSetter(normalizeErrorMessage(error), 'error')
        }
    }

    const notificationSetter = (message, severity = 'success') => {
        setNotification({ message, severity })

        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current)
        }

        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null)
            notificationTimeoutRef.current = null
        }, 3500)
    }

    //usematch logic

    const match = useMatch('blogs/:id')
    const blog = match ? blogs.find((b) => b.id === match.params.id) : null
    const navButtonSx = {
        minWidth: 0,
        px: 1,
        py: 0.35,
        fontSize: '0.8125rem',
        fontWeight: 500,
        textTransform: 'none',
        borderRadius: 1.5,
        color: 'text.secondary',
        '&:hover': {
            bgcolor: '#eff6ff',
            color: '#0369a1',
        },
    }
    const accentButtonSx = {
        ...navButtonSx,
        px: 1.15,
        color: '#0369a1',
        borderColor: '#bae6fd',
        bgcolor: '#f0f9ff',
        '&:hover': {
            borderColor: '#7dd3fc',
            bgcolor: '#e0f2fe',
        },
    }

    //check the  login route asap
    return (
        <div>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(248, 252, 255, 0.92)',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: '#dbeafe',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <Container maxWidth="lg" disableGutters>
                    <Toolbar
                        disableGutters
                        sx={{
                            minHeight: 50,
                            px: { xs: 1.5, sm: 2 },
                            gap: 0.75,
                        }}
                    >
                        <Typography
                            component={Link}
                            to="/"
                            variant="subtitle1"
                            sx={{
                                color: '#0369a1',
                                textDecoration: 'none',
                                fontWeight: 600,
                                letterSpacing: 0,
                                lineHeight: 1,
                            }}
                        >
                            bloglist
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.25,
                                ml: 1.5,
                            }}
                        >
                            <Button
                                component={Link}
                                to="/"
                                variant="text"
                                size="small"
                                sx={navButtonSx}
                            >
                                blogs
                            </Button>
                            {user && (
                                <Button
                                    component={Link}
                                    to="/create"
                                    variant="outlined"
                                    size="small"
                                    sx={accentButtonSx}
                                >
                                    new blog
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                            }}
                        >
                            {user && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        display: { xs: 'none', sm: 'block' },
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                        fontSize: '0.8125rem',
                                        letterSpacing: 0,
                                    }}
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
                                    sx={accentButtonSx}
                                >
                                    login
                                </Button>
                            ) : (
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleLogout}
                                    sx={navButtonSx}
                                >
                                    logout
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box sx={{ px: 2 }}>
                <Notification
                    message={notification?.message}
                    severity={notification?.severity}
                />
            </Box>
            <Routes>
                <Route
                    path="/create"
                    element={<BlogForm createOnSubmit={createBlog} />}
                />
                <Route
                    path="/blogs/:id"
                    element={
                        <Blog
                            blog={blog}
                            likeBlog={updateBlog}
                            deleteBlog={deleteBlog}
                            user={user}
                        />
                    }
                />
                <Route path="/" element={<Blogs blogs={blogs} />} />
                <Route
                    path="/login"
                    element={<Login loginHandler={handleLogin} />}
                />
            </Routes>
        </div>
    )
}

export default App
