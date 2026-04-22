const Login = ({
    username,
    password,
    loginHandler,
    userHandler,
    passHandler,
}) => {
    return (
        <div>
            <h2>Login to application</h2>
            <form onSubmit={loginHandler}>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={username}
                            onChange={userHandler}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={password}
                            onChange={passHandler}
                        />
                    </label>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login
