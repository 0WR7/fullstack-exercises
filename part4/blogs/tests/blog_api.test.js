const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helpers')

const Blog = require('../models/blog')

const api = supertest(app)

//notouch
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('Main route 4.8', () => {
    test('returns all blogs', async () => {
        const response = await api.get('/api/blogs') //6

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('4.9', () => {
    test(' the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs/')
        const blogs = response.body
        for (const blog of blogs) {
            assert(Object.hasOwn(blog, 'id'))
            assert(!Object.hasOwn(blog, '_id'))
        }
    })
})

describe('4.10', () => {
    test('a request to the /api/blogs URL successfully creates a new blog post', async () => {
        const newBlog = helper.listWithOneBlog[0]

        await api
            .post('/api/blogs/')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })
})

describe('4.11', () => {
    test('if the likes property is missing from the request, it will default to the value 0', async () => {
        const blogObject = new Blog(helper.listWithOneBlog[0]).toJSON()
        const { likes, ...blogWithoutLikes } = blogObject

        const response = await api.post('/api/blogs/').send(blogWithoutLikes)

        const returnedBlog = response.body

        assert.strictEqual(returnedBlog.likes, 0)
    })
})

describe('4.12', () => {
    test('title or url missing return 400 bad request', async () => {
        const blogObject = new Blog(helper.listWithOneBlog[0]).toJSON()

        const { title, ...blogNoTitle } = blogObject
        const { url, ...blogNoUrl } = blogObject

        await api.post('/api/blogs').send(blogNoTitle).expect(400)
        await api.post('/api/blogs').send(blogNoUrl).expect(400)
        await api.post('/api/blogs/').send(blogObject).expect(201)
    })
})

describe('4.13', () => {
    test('functionality for deleting a single blog post resource', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToDelete = initialBlogs[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const ids = blogsAtEnd.map((b) => b.id)
        assert(!ids.includes(blogToDelete.id))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
})

describe('4.14', () => {
    test('functionality for updating blog likes', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToUpdate = initialBlogs[0]

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)

        const updatedBlog = response.body

        console.log(updatedBlog)
        assert.strictEqual(blogToUpdate.likes, updatedBlog.likes)
    })
})

//notouch
after(async () => {
    await mongoose.connection.close()
})
