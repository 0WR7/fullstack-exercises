import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
    token = newToken ? `Bearer ${newToken}` : null
}

const getAll = async () => {
    const request = await axios.get(baseUrl)
    return request.data
}

const create = async (newBlog) => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

const update = async (blog) => {
    const url = `${baseUrl}/${blog.id}`
    const response = await axios.put(url, blog)
    return response.data
}

const deleteBlog = async (blogId) => {
    const url = `${baseUrl}/${blogId}`
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.delete(url, config)
    return response.status
}

export default { getAll, create, update, deleteBlog, setToken }
