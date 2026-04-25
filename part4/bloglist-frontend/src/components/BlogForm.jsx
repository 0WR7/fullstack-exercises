import {
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'

const BlogForm = ({ createOnSubmit }) => {
    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

    const addBlog = (event) => {
        event.preventDefault()
        createOnSubmit({
            ...newBlog,
        })

        setNewBlog({ title: '', author: '', url: '' })
    }

    const handleValueChange = (event) => {
        const { name, value } = event.target
        setNewBlog((prevBlog) => ({ ...prevBlog, [name]: value }))
    }

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={0}
                sx={{
                    mt: 1.5,
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                }}
            >
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
                            name="title"
                            value={newBlog.title}
                            onChange={handleValueChange}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            id="author"
                            label="Author"
                            name="author"
                            value={newBlog.author}
                            onChange={handleValueChange}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            id="url"
                            label="Url"
                            name="url"
                            value={newBlog.url}
                            onChange={handleValueChange}
                            fullWidth
                            size="small"
                        />
                        <Button
                            size="small"
                            variant="contained"
                            type="submit"
                            sx={{ alignSelf: 'flex-start', px: 3 }}
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
