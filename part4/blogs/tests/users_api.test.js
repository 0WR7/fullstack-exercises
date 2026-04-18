const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helpers')

const User = require('../models/user')

const api = supertest(app)

describe('4.16-~', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    test('Username must be 3 chars minimum', async () => {
        const initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'Gi',
            name: 'Minimalist',
            password: '12345',
        }

        await api.post('/api/users/').send(newUser).expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(initialUsers.length, usersAtEnd.length)
    })
    test('Password must be 3 chars minimum', async () => {
        const initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'Jordan',
            name: 'Michael',
            password: '23',
        }

        const response = await api.post('/api/users/').send(newUser).expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert(
            response.body.error.includes('password is less than 3 characters')
        )
        assert.strictEqual(initialUsers.length, usersAtEnd.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
