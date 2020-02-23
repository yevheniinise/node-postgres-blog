const express = require('express')
const {query} = require('../db')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const {rows} = await query('SELECT * FROM article;')
    const userIds = rows
      .map(article => article.user_id)
      .filter((userId, index, self) => self.indexOf(userId) === index)
    const userPromises = userIds.map(id =>
      query('SELECT id, first_name, last_name FROM "user" WHERE id = $1', [
        id,
      ]).then(result => result.rows[0]),
    )
    const users = await Promise.all(userPromises)

    res.render('index', {
      url: req.originalUrl,
      articles: rows,
      authors: users.reduce((obj, user) => {
        const newObj = {...obj}
        newObj[user.id] = `${user.first_name} ${user.last_name}`
        return newObj
      }, {}),
      user: req.session.user ? req.session.user : null,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:article', async (req, res, next) => {
  const alias = req.params.article
  const data = {
    url: req.originalUrl,
    user: req.session.user ? req.session.user : null,
  }

  try {
    const articleResult = await query(
      'SELECT title, preview, content, created_at, user_id FROM article WHERE alias = $1;',
      [alias],
    )

    if (!articleResult.rowCount) {
      res.render('error', {
        ...data,
        status: 404,
        message: 'Not Found',
      })
      return
    }

    const article = articleResult.rows[0]
    const authorResult = await query(
      'SELECT first_name, last_name FROM "user" WHERE id = $1;',
      [article.user_id],
    )
    const author = authorResult.rows[0]
    res.render('article', {...data, article, author})
  } catch (error) {
    next(error)
  }
})

module.exports = router
