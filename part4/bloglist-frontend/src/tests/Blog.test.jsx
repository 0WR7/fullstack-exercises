import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('<Blog />', () => {
    const blog = {
        title: 'Blog component test',
        author: 'Json Smith',
        url: 'google.com',
        likes: 777,
        id: 1234,
        user: {
            id: 'user-123',
            name: 'Json Smith',
            username: 'jsonsmith',
        },
    }

    test('blog information and likes are displayed to unauthenticated users without action buttons', async () => {
        render(<Blog blog={blog} />)

        const user = userEvent.setup()

        expect(
            screen.getByText('Blog component test Json Smith', {
                exact: false,
            })
        ).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'view' }))

        expect(screen.getByText('google.com')).toBeVisible()
        expect(screen.getByText('likes 777')).toBeVisible()
        expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
        expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
    })

    test('like button clicked twice calls the event handler received as props twice', async () => {
        const likeBlog = vi.fn()

        render(
            <Blog
                blog={blog}
                likeBlog={likeBlog}
                user={{
                    username: 'John',
                    password: '1234',
                    name: 'confucious',
                }}
            />
        )

        const user = userEvent.setup()

        await user.click(screen.getByRole('button', { name: 'view' }))

        const likeButton = screen.getByRole('button', { name: 'like' })

        await user.click(likeButton)
        await user.click(likeButton)

        expect(likeBlog.mock.calls).toHaveLength(2)
    })

    test('authenticated users who are not the creator are shown only the like button', async () => {
        const user = userEvent.setup()

        render(
            <Blog
                blog={blog}
                likeBlog={vi.fn()}
                user={{ username: 'otheruser', name: 'Other User' }}
            />
        )

        await user.click(screen.getByRole('button', { name: 'view' }))

        expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
        expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
    })

    test('the blog creator is also shown the delete button', async () => {
        const blogWithUser = {
            ...blog,
            user: {
                id: 'user-123',
                name: 'Json Smith',
                username: 'jsonsmith',
            },
        }
        const user = userEvent.setup()

        render(
            <Blog
                blog={blogWithUser}
                likeBlog={vi.fn()}
                deleteBlog={vi.fn()}
                user={blogWithUser.user}
            />
        )

        await user.click(screen.getByRole('button', { name: 'view' }))

        expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
    })
})
