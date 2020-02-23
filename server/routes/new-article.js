const express = require('express')
const {query} = require('../db')

const router = express.Router()

router.use('/', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login')
    return
  }
  next()
})

router.get('/', (req, res) => {
  res.render('new-article', {
    url: req.originalUrl,
    user: req.session.user ? req.session.user : null,
  })
})

router.post('/create', async (req, res, next) => {
  const {title, preview, content} = req.body
  const alias = title.toLocaleLowerCase().replace(/\s/, '-')
  const userId = req.session.user.id
  try {
    await query(
      'INSERT INTO article(title, preview, content, alias, user_id) VALUES($1, $2, $3, $4, $5);',
      [title, preview, content, alias, userId],
    )
    res.redirect('/new-article')
  } catch (error) {
    next(error)
  }
})

module.exports = router
