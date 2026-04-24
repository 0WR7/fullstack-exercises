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

    test('renders title and author but on URL or likes', () => {
        //since its one <p> that renders both
        render(<Blog blog={blog} />)

        const titleAndAuthorP = screen.getByText(
            'Blog component test Json Smith',
            {
                exact: false,
            }
        )
        const url = screen.queryByText('google.com')
        const likes = screen.queryByText('777')

        expect(titleAndAuthorP).toBeDefined()
        expect(url).toBeNull()
        expect(likes).toBeNull()
    })

    test('url and likes are shown when button is pressed', async () => {
        render(<Blog blog={blog} />)

        const user = userEvent.setup()
        const button = screen.getByText('view')

        await user.click(button)

        //fails if not --could be queryByText instead
        const url = screen.getByText('google.com')
        const likes = screen.getByText('likes 777')

        expect(url).toBeVisible()
        expect(likes).toBeVisible()
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
        const button = screen.getByText('view')

        await user.click(button)

        const likeButton = screen.getByText('like')

        await user.click(likeButton)
        await user.click(likeButton)

        expect(likeBlog.mock.calls).toHaveLength(2)
    })

    test('remove button is rendered only for the user who created the blog', async () => {
        const blogWithUser = {
            ...blog,
            user: {
                id: 'user-123',
                name: 'Json Smith',
                username: 'jsonsmith',
            },
        }
        const user = userEvent.setup()
        const { rerender } = render(
            <Blog blog={blogWithUser} user={blogWithUser.user} />
        )

        await user.click(screen.getByText('view'))

        expect(screen.getByText('remove')).toBeVisible()

        rerender(
            <Blog
                blog={blogWithUser}
                user={{ username: 'Albatros', id: 'ssdramhdd' }}
            />
        )

        expect(screen.queryByText('remove')).toBeNull()
    })
})
