import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../pages/BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createOnSubmit={createBlog} />)

    const titleInput = screen.getByLabelText('Title')
    const authorInput = screen.getByLabelText('Author')
    const urlInput = screen.getByLabelText('Url')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'TestBlog1')
    await user.type(authorInput, 'Json Smith')
    await user.type(urlInput, 'google.com')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('TestBlog1')
    expect(createBlog.mock.calls[0][0].author).toBe('Json Smith')
    expect(createBlog.mock.calls[0][0].url).toBe('google.com')
})
