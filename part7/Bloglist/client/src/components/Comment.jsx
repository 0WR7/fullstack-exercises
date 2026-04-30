import { Button, Stack, TextField, Typography } from '@mui/material'
import useField from '../hooks/useField'
import { useBlogActions } from '../stores/blogStore'
import { useNotificationActions } from '../stores/notificationStore'

const Comment = ({ blog }) => {
    const { addComment } = useBlogActions()
    const { setNotification } = useNotificationActions()
    const comment = useField('text')

    const handleComment = async (event) => {
        event.preventDefault()

        const content = comment.value.trim()
        if (!content) {
            setNotification('Comment cannot be empty', 'error')
            return
        }

        try {
            await addComment(blog.id, content)
            setNotification('Added comment', 'success')
            comment.reset?.()
        } catch (_error) {
            setNotification('Failed to add comment', 'error')
        }
    }

    return (
        <section className="comment-section">
            <Typography component="h3" className="comment-title">
                Comments
            </Typography>
            <Stack
                component="form"
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                onSubmit={handleComment}
                className="comment-form"
            >
                <TextField
                    type={comment.type}
                    value={comment.value}
                    onChange={comment.onChange}
                    placeholder="Add a comment"
                    size="small"
                    fullWidth
                    className="comment-input"
                />
                <Button
                    type="submit"
                    variant="contained"
                    className="comment-submit"
                >
                    Add
                </Button>
            </Stack>
            <ul className="comment-list">
                {blog.comments?.map((comment) => (
                    <li className="comment-list-item" key={comment.id ?? comment}>
                        {comment.content ?? comment}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Comment
