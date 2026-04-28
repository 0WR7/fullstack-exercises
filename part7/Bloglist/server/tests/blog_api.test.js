const assert = require('node:assert')
const { test, after, beforeEach, describe, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helpers')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest.agent(app)

//notouch
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})
let token

before(async () => {
    await User.deleteMany({})
    await api.post('/api/users').send({
        name: 'Tester',
        username: 'Tester',
        password: 'Tester',
    })

    const response = await api.post('/api/login').send({
        username: 'Tester',
        password: 'Tester',
    })

    token = response.body.token
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
            .set('Authorization', `Bearer ${token}`)
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

        const response = await api
            .post('/api/blogs/')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutLikes)

        const returnedBlog = response.body

        assert.strictEqual(returnedBlog.likes, 0)
    })
})

describe('4.12', () => {
    test('title or url missing return 400 bad request', async () => {
        const blogObject = new Blog(helper.listWithOneBlog[0]).toJSON()

        const { title, ...blogNoTitle } = blogObject
        const { url, ...blogNoUrl } = blogObject

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogNoTitle)
            .expect(400)
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogNoUrl)
            .expect(400)
        await api
            .post('/api/blogs/')
            .set('Authorization', `Bearer ${token}`)
            .send(blogObject)
            .expect(201)
    })
})

describe('4.13', () => {
    test('a blog can be deleted by the user who created it', async () => {
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(helper.newBlog)
            .expect(201)

        const blogToDelete = response.body

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        const ids = blogsAtEnd.map((b) => b.id)

        assert(!ids.includes(blogToDelete.id))
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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

        assert.strictEqual(blogToUpdate.likes, updatedBlog.likes)
    })
})

describe('4.23', () => {
    test('adding a blog fails with the proper status code 401 Unauthorized if a token is not provided', async () => {
        blogsAtStart = await helper.blogsInDb()

        response = await api
            .post('/api/blogs/')
            //no auth
            .send(helper.newBlog)
            .expect(401)

        blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })
})

//notouch
after(async () => {
    await mongoose.connection.close()
})
