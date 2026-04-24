import { useState } from 'react'

//rewrite with conditional rendering

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const canRemove = blog?.user?.username === user?.username

    return (
        <div style={blogStyle} className="blog">
            <p>
                {blog.title} {blog.author}
            </p>
            {!visible ? (
                <button onClick={toggleVisibility}>view</button>
            ) : (
                <div>
                    <button onClick={toggleVisibility}>hide</button>
                    <p>
                        <a href={blog.url}> {blog.url}</a>
                    </p>
                    <p className="likes">likes {blog.likes}</p>
                    {user && (
                        <button onClick={() => likeBlog(blog)}>like</button>
                    )}
                    <p> {blog?.user?.name}</p>
                    {canRemove && (
                        <button onClick={() => deleteBlog(blog.id)}>
                            remove
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Blog
