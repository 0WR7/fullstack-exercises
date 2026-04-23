import Blog from './Blog'

const Blogs = ({ blogs }) => {
    return (
        <div>
            <h4>Blogs</h4>
            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    )
}

export default Blogs
