const blogRouter = require('express').Router()
const { assignWith } = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    if (!blog.url || !blog.title) {
        return response.status(400).json({ error: 'Missing blog url or title' })
    }

    const randomUser = await User.findOne({})
    blog.user = randomUser._id

    const result = await blog.save()
    return response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
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
