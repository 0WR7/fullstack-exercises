import './stylesheets/App.css'
import { useEffect, useRef, useState } from 'react'
import {
    Link,
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
    useMatch,
    useNavigate,
} from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Blogs from './components/BlogList'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import normalizeErrorMessage from './helpers/errorHandling'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notification, setNotification] = useState(null)
    const [user, setUser] = useState(null)

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

    const notificationSetter = (message, type) => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification(null)
        }, 3500)
    }

    //usematch logic

    const match = useMatch('blogs/:id')
    const blog = match ? blogs.find((b) => b.id === match.params.id) : null

    //check the  login route asap
    return (
        <div>
            <div>
                <Link to={'/'}>blogs</Link>
                <Link to={'/create'}>new blog</Link>
                {!user ? (
                    <Link to={'/login'}>login</Link>
                ) : (
                    <button type="button" onClick={handleLogout}>
                        logout
                    </button>
                )}
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
