import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Blog from '../components/Blog'
import { useBlogActions, useBlogs } from '../stores/blogStore'

const BlogPage = () => {
    const { id } = useParams()
    const { blogs, initialized } = useBlogs()
    const { initialize } = useBlogActions()

    useEffect(() => {
        initialize()
    }, [initialize])

    const blog = blogs.find((b) => b.id === id)

    if (!initialized) {
        return null
    }

    if (!blog) {
        return <h3>404 not found</h3>
    }

    return <Blog blog={blog} />
}

export default BlogPage
