const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

describe("total likes", () => {
	test("when list has only one blog, equals the likes of that", () => {
		const result = listHelper.totalLikes(listWithOneBlog);
		assert.strictEqual(result, 5);
	});

	test("multiple blogs total likes", () => {
		const result = listHelper.totalLikes(blogs);
		assert.strictEqual(result, 36);
	});
});

describe("most liked blog", () => {
	test("when list has only one blog", () => {
		const result = listHelper.favoriteBlog(listWithOneBlog);
		assert.strictEqual(result._id, "5a422aa71b54a676234d17f8");
		assert.strictEqual(result.likes, 5);
	});

	test("when list has many blogs", () => {
		const result = listHelper.favoriteBlog(blogs);
		assert.strictEqual(result.likes, 12);
	});

	test("when list is empty, returns null", () => {
		const result = listHelper.favoriteBlog([]);
		assert.strictEqual(result, null);
	});
});
