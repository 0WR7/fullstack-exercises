import './stylesheets/App.css'
import { useEffect, useRef, useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import normalizeErrorMessage from './helpers/errorHandling'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notification, setNotification] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({ username, password })

            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch {
            notificationSetter('Wrong username or password', 'error')
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        setUser(null)
        blogService.setToken(null)
        window.localStorage.removeItem('loggedBlogappUser')
    }

    //links to BlogForm
    const createBlog = async (blogObject) => {
        try {
            blogFormRef.current.toggleVisibility()
            const returnedBlog = await blogService.create(blogObject)
            const createdBlog = { ...returnedBlog, user }
            setBlogs((prevBlogs) => prevBlogs.concat(createdBlog))
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

    //blog show logic
    const blogFormRef = useRef()

    const blogForm = () => {
        return (
            <Togglable buttonLabel={'create'} ref={blogFormRef}>
                <BlogForm createOnSubmit={createBlog} />
            </Togglable>
        )
    }

    return (
        
        
        <div>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            )}
            {!user && (
                <Login
                    loginHandler={handleLogin}
                    username={username}
                    password={password}
                    userHandler={(e) => setUsername(e.target.value)}
                    passHandler={(e) => setPassword(e.target.value)}
                />
            )}
            {user && (
                <div>
                    <h2>Blogs</h2>
                    <p> {user.name} logged in</p>
                    <button type="button" onClick={(e) => handleLogout(e)}>
                        logout
                    </button>
                    {blogForm()}
                    {blogs
                        .toSorted((a, b) => b.likes - a.likes)
                        .map((blog) => (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                likeBlog={updateBlog}
                                deleteBlog={deleteBlog}
                                username={user.username}
                            />
                        ))}
                </div>
            )}
        </div>
    )
}

export default App
