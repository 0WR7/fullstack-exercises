import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
    blogs: [],
    initialized: false,
    actions: {
        add: async (blog) => {
            const newBlog = await blogService.create(blog)
            set((state) => ({
                blogs: state.blogs.concat(newBlog),
            }))
        },
        update: async (blog) => {
            const blogToUpdate = {
                ...blog,
                likes: blog.likes + 1,
            }

            const returnedBlog = await blogService.update(blogToUpdate)
            set((state) => ({
                blogs: state.blogs.map((currentBlog) =>
                    currentBlog.id === returnedBlog.id
                        ? returnedBlog
                        : currentBlog
                ),
            }))
        },
        deleteBlog: async (blogId) => {
            await blogService.deleteBlog(blogId)
            set((state) => ({
                blogs: state.blogs.filter((blog) => blog.id !== blogId),
            }))
        },
        addComment: async (blogId, content) => {
            const returnedBlog = await blogService.addComment(blogId, {
                content,
            })
            set((state) => ({
                blogs: state.blogs.map((currentBlog) =>
                    currentBlog.id === returnedBlog.id
                        ? returnedBlog
                        : currentBlog
                ),
            }))
        },
        initialize: async () => {
            const blogs = await blogService.getAll()
            set(() => ({ blogs, initialized: true }))
        },
    },
}))

export const useBlogs = () => {
    const blogs = useBlogStore((state) => state.blogs)
    const initialized = useBlogStore((state) => state.initialized)
    return { blogs, initialized }
}

export const useBlogActions = () => {
    return useBlogStore((state) => state.actions)
}
