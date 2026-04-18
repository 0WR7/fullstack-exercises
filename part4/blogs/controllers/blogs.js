const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const body = request.body

    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'Unauthorized' })
    }
    const blog = new Blog({
        ...body,
        user: user._id,
    })

    if (!blog.url || !blog.title) {
        return response.status(400).json({ error: 'Missing blog url or title' })
    }

    const result = await blog.save()
    return response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(400).json({ error: 'You are not logged in' })
    }
    const blogToDelete = await Blog.findById(request.params.id)

    if (blogToDelete.user.toString() !== user.id.toString()) {
        return response
            .status(401)
            .json({ error: 'Trying to delete another user`s content' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    //could implement more functionality
    const { likes } = request.body

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }
    blog.likes = likes
    const updatedBlog = await blog.save()
    return response.json(updatedBlog)
})

module.exports = blogRouter
