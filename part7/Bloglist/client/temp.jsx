;<div>
    {notification && (
        <Notification message={notification.message} type={notification.type} />
    )}
    {!user && (
        <Login
            loginHandler={handleLogin}
            username={username}
            password={password}
            userHandler={(e) => setUsername(e.target.value)}
            passHandler={(e) => setPassword(e.target.value)}
        />
    )}
    {user && (
        <div>
            <h2>Blogs</h2>
            <p> {user.name} logged in</p>
            <button type="button" onClick={(e) => handleLogout(e)}>
                logout
            </button>
            {blogForm()}
            {blogs
                .toSorted((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        likeBlog={updateBlog}
                        deleteBlog={deleteBlog}
                        username={user.username}
                    />
                ))}
        </div>
    )}
</div>
