import {
    AppBar,
    Button,
    Container,
    Toolbar,
    Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import Notification from './components/Notification'
import normalizeErrorMessage from './helpers/errorHandling'
import Blog from './pages/Blog'
import BlogForm from './pages/BlogForm'
import Blogs from './pages/BlogList'
import Login from './pages/Login'
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
    //check the  login route asap
    return (
        <div>
            <AppBar
                position="sticky"
                elevation={0}
                className="app-bar"
            >
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
                                blogs
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
                                    onClick={handleLogout}
                                    className="nav-button"
                                >
                                    logout
                                </Button>
                            )}
                        </div>
                    </Toolbar>
                </Container>
            </AppBar>
            <div className="notification-wrap">
                <Notification
                    message={notification?.message}
                    severity={notification?.severity}
                />
            </div>
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
