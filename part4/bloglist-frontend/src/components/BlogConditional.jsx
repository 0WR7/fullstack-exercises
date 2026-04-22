import { useState } from 'react'

const BlogConditional = ({ blog }) => {
    const [visible, setVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    const toggleVisibility = () => {
        setVisible((current) => !current)
    }

    return (
        <div style={blogStyle}>
            <p>
                {blog.title} {blog.author}
            </p>
            <button type="button" onClick={toggleVisibility}>
                {visible ? 'hide' : 'view'}
            </button>
            {visible && (
                <div>
                    <p>{blog.url}</p>
                    <p>{blog.likes}</p>
                </div>
            )}
        </div>
    )
}

export default BlogConditional
