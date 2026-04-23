const loginWith = async (page, username, password) => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createDummyBlog = async (page, { title, author, url,}) => {
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByLabel('title:').fill(title)
    await page.getByLabel('author:').fill(author)
    await page.getByLabel('url:').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}

const isSortedDesc = (array) => {
    return array.every((val, i, array) => i === 0 || array[i - 1] >= val)
}

export { loginWith, createDummyBlog, isSortedDesc}
