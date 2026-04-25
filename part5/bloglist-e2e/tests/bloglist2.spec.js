// Login succeeds with the correct username/password combination
// Login fails if the username/password is incorrect
// A logged-in user can create a blog
// A logged-in user can like blogs
// A logged-in user can delete a blog

const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createNewBlog } = require('./helper')

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

    describe('Login testing', () => {
        test('Login succeeds with correct username/password', async ({
            page,
        }) => {
            await loginWith(page, 'Tester', '123456')

            await expect(
                page.getByRole('button', { name: 'logout' })
            ).toBeVisible()
        })

        test('Login fails with incorrect username/password', async ({
            page,
        }) => {
            await loginWith(page, 'Jester', '25555992')

            await expect(
                page.getByRole('link', { name: 'login' })
            ).toBeVisible()
        })
    })

    describe('logged in user testing', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Tester', '123456')
        })

        test('A logged in user can create a blog', async ({ page }) => {
            await createNewBlog(page, {
                title: 'A new test',
                author: 'Json Smith',
                url: 'Google.com',
            })

            await expect(page.getByText('A new test')).toBeVisible()
        })

        test('A logged in user can like blogs', async ({ page }) => {
            await createNewBlog(page, {
                title: 'Brand new',
                author: 'Someone',
                url: 'amazon.de',
            })

            await page.getByRole('link', { name: 'Brand new' }).click()
            await page.getByRole('button', { name: 'view' }).click()
            const likes = page.locator('.likes')
            await page.getByRole('button', { name: 'like' }).click()
            await expect(likes).toHaveText('likes 1')
        })

        test('A user can delete a blog', async ({ page }) => {
            await createNewBlog(page, {
                title: 'About to go',
                author: 'Json Smith',
                url: 'anthropic.com',
            })
            await page.getByRole('link', { name: 'About to go' }).click()
            const blog = page
                .locator('.blog')
                .filter({ hasText: 'About to go' })

            await blog.getByRole('button', { name: 'view' }).click()

            page.on('dialog', (dialog) => dialog.accept())
            await blog.getByRole('button', { name: 'remove' }).click()

            await expect(
                page.getByRole('link', { name: 'About to go' })
            ).not.toBeVisible()
        })
    })
})
