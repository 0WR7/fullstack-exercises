import { useState } from 'react'

const BlogForm = ({ createOnSubmit }) => {
    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

    const addBlog = (event) => {
        event.preventDefault()
        createOnSubmit({
            ...newBlog,
        })

        setNewBlog({ title: '', author: '', url: '' })
    }

    const handleValueChange = (event) => {
        const { name, value } = event.target
        setNewBlog((prevBlog) => ({ ...prevBlog, [name]: value }))
    }

    return (
        <div>
            <h4>Create new</h4>
            <form onSubmit={addBlog}>
                <label>
                    title:
                    <input
                        name="title"
                        value={newBlog.title}
                        onChange={handleValueChange}
                    />
                </label>
                <label>
                    author:
                    <input
                        name="author"
                        value={newBlog.author}
                        onChange={handleValueChange}
                    />
                </label>
                <label>
                    url:
                    <input
                        name="url"
                        value={newBlog.url}
                        onChange={handleValueChange}
                    />
                </label>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
