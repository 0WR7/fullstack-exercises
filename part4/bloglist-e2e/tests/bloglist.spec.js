const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createDummyBlog, isSortedDesc } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Json Smith',
                username: 'Tester',
                password: '123456',
            },
        })

        await page.goto('http://localhost:5173')
    })

    test('login form is shown', async ({ page }) => {
        const locator = page.getByText('Login to application')
        const usernameInput = page.getByLabel('username')
        const passwordInput = page.getByLabel('password')
        const submitButton = page.getByRole('button')

        await expect(locator).toBeVisible()
        await expect(usernameInput).toBeVisible()
        await expect(passwordInput).toBeVisible()
        await expect(submitButton).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'Tester', '123456')

            await expect(page.getByText('Json Smith logged in')).toBeVisible()
            await expect(page.getByText('Blogs')).toBeVisible()
        })

        test('fails with incorrect credentials', async ({ page }) => {
            await loginWith(page, 'Jester', '7777')

            const errorDiv = page.locator('.notification')
            await expect(errorDiv).toContainText('Wrong username or password')
            await expect(
                page.getByText('Json Smith logged in')
            ).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Tester', '123456')
        })

        test('a new blog can be created', async ({ page }) => {
            await createDummyBlog(page, {
                title: 'Playwright blog',
                author: 'Json Smith',
                url: 'http://localhost.com',
            })

            //notification
            await expect(
                page.getByText(
                    `A new blog Playwright blog by Json Smith was added`
                )
            ).toBeVisible()
            //get the blog div
            const blog = page.locator('.blog')
            await expect(blog).toContainText('Playwright blog Json Smith')
        })

        test('a blog can be liked', async ({ page }) => {
            await createDummyBlog(page, {
                title: 'Testing Blog',
                author: 'Jacob Smith',
                url: 'google.com',
            })
            const blog = page.locator('.blog')

            await blog.getByRole('button', { name: 'view' }).click()

            const likes = blog.locator('.likes')

            await blog.getByRole('button', { name: 'like' }).click()

            await expect(likes).toHaveText('likes 1')
        })

        test('a blog can be removed', async ({ page }) => {
            await createDummyBlog(page, {
                title: 'Testing Blog',
                author: 'Jacob Smith',
                url: 'google.com',
            })
            const blog = page.locator('.blog')

            await blog.getByRole('button', { name: 'view' }).click()

            page.on('dialog', (dialog) => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()

            await expect(page.locator('.blog')).toHaveCount(0)
        })
        test('only the user who added the blog sees the blog`s delete button', async ({
            page,
            request,
        }) => {
            await createDummyBlog(page, {
                title: 'Testing Blog',
                author: 'Jacob Smith',
                url: 'google.com',
            })

            await page.getByText('logout').click()

            await request.post('http://localhost:3001/api/users', {
                data: {
                    name: 'Second User',
                    username: 'Tester2',
                    password: '123456',
                },
            })

            await loginWith(page, 'Tester2', '123456')
            await expect(page.getByText('Second User logged in')).toBeVisible()

            const blog = page.locator('.blog').filter({
                hasText: 'Testing Blog Jacob Smith',
            })

            await blog.getByRole('button', { name: 'view' }).click()

            await expect(
                blog.getByRole('button', { name: 'remove' })
            ).toHaveCount(0)
        })

        test(' the blogs are arranged in the order according to the likes', async ({
            page,
            request,
        }) => {
            const blogs = [
                {
                    title: 'Blog no1',
                    likes: 2,
                },
                {
                    title: 'Blog no2',
                    likes: 12,
                },
                {
                    title: 'Blog no3',
                    likes: 6,
                },
            ]

            const loginResponse = await request.post(
                'http://localhost:3001/api/login',
                {
                    data: {
                        username: 'Tester',
                        password: '123456',
                    },
                }
            )
            const { token } = await loginResponse.json()

            for (const blog of blogs) {
                await request.post('http://localhost:3001/api/blogs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: {
                        author: 'Json Smith',
                        title: blog.title,
                        url: 'Google.com',
                        likes: blog.likes,
                    },
                })
            }

            await page.reload()

            const blogElements = page.locator('.blog')
            await expect(blogElements).toHaveCount(3)
            const titles = await blogElements.evaluateAll((blogs) =>
                blogs.map((blog) => blog.textContent.match(/Blog no\d+/)?.[0])
            )

            expect(titles).toEqual(['Blog no2', 'Blog no3', 'Blog no1'])
        })
    })
})
