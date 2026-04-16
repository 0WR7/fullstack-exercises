const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
    const favorite = blogs.length
        ? blogs.reduce((most, blog) => (blog.likes > most.likes ? blog : most))
        : null;
    return favorite;
};

const mostBlogs = (blogs) => {
    const counts = _.countBy(blogs, "author");
    const [author, count] = _.maxBy(
        Object.entries(counts),
        ([author, count]) => count,
    );

    return { author, blogs: count };
};

const mostLikes = (blogs) => {
    const authors = _.groupBy(blogs, "author");

    const totals = _.map(authors, (personalBlogs, author) => ({
        author,
        likes: _.sumBy(personalBlogs, "likes"),
    }));

    return _.maxBy(totals, "likes");
};

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes };
