import {
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useField from '../hooks/useField'
import { useBlogActions } from '../stores/blogStore'
import { useNotificationActions } from '../stores/notificationStore'
import { useUser } from '../stores/userStore'

const BlogForm = ({ createOnSubmit }) => {
    const { user } = useUser()
    const title = useField('text')
    const author = useField('text')
    const url = useField('text')
    const { add } = useBlogActions()
    const navigate = useNavigate()
    const { setNotification } = useNotificationActions()

    const addBlog = async (event) => {
        event.preventDefault()
        const newBlog = {
            title: title.value,
            author: author.value,
            url: url.value,
        }

        try {
            if (createOnSubmit) {
                createOnSubmit(newBlog)
                return
            }

            await add({ ...newBlog, user })
            const message = `A new blog ${newBlog.title} by ${newBlog.author} was added`
            setNotification(message, 'success')
            navigate('/')
        } catch (_error) {
            setNotification('failed to create blog', 'error')
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={0} className="form-panel form-panel-compact">
                <Stack spacing={2}>
                    <Typography variant="h6" component="h4">
                        Create new
                    </Typography>
                    <Stack
                        component="form"
                        spacing={2}
                        onSubmit={addBlog}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="title"
                            label="Title"
                            {...title}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            id="author"
                            label="Author"
                            {...author}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            id="url"
                            label="Url"
                            {...url}
                            fullWidth
                            size="small"
                        />
                        <Button
                            size="small"
                            variant="contained"
                            type="submit"
                            className="form-submit form-submit-wide"
                        >
                            create
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    )
}

export default BlogForm
