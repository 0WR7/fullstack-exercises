import { useEffect } from 'react'
import {
    Container,
    Link as MuiLink,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useUsers, useUsersActions } from '../stores/usersStore'

const UsersList = () => {
    const { users } = useUsers()
    const { initialize } = useUsersActions()

    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <Container maxWidth="md" className="page-container">
            <Paper elevation={0} className="page-panel">
                <Typography variant="h5" component="h1" className="page-title">
                    Users
                </Typography>
                <TableContainer className="data-table-wrap">
                    <Table size="small" className="data-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell align="right">
                                    Blogs Created
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <MuiLink
                                            component={Link}
                                            to={`/users/${user.id}`}
                                            underline="hover"
                                            className="content-link"
                                        >
                                            {user.name}
                                        </MuiLink>
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell align="right">
                                        {user.blogs.length}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    )
}

export default UsersList
