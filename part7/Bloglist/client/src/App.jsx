import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import Notification from './components/Notification'
import BlogForm from './pages/BlogForm'
import BlogList from './pages/BlogList'
import BlogPage from './pages/BlogPage'
import Login from './pages/Login'
import UserPage from './pages/UserPage'
import UsersList from './pages/UserList'
import { useUserActions } from './stores/userStore'

const App = () => {
    const { initialize } = useUserActions()

    useEffect(() => {
        initialize()
    }, [initialize])

    //check the  login route asap
    return (
        <div>
            <AppHeader />
            <ErrorBoundary fallback={<div>Something went terribly wrong</div>}>
                <div className="notification-wrap">
                    <Notification />
                </div>
                <Routes>
                    <Route path="/create" element={<BlogForm />} />
                    <Route path="/blogs/:id" element={<BlogPage />} />
                    <Route path="/" element={<BlogList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/users/:id" element={<UserPage />} />
                    <Route path="*" element={<h3>404 not found</h3>} />
                </Routes>
            </ErrorBoundary>
        </div>
    )
}

export default App
