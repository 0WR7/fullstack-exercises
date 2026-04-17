const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogRouter.post("/", (request, response) => {
	const blog = new Blog(request.body);

	//implement the validation at schema
	if (!blog.url || !blog.title) {
		return response.sendStatus(400);
	}

	blog.save().then((result) => {
		response.status(201).json(result);
	});
});

module.exports = blogRouter;
