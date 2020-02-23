const express = require('express')
const bcrypt = require('bcrypt')
const {query} = require('../db')

const router = express.Router()

function renderLoginPage(req, res) {
  if (req.session.user) {
    res.redirect('/')
    return
  }

  if (req.errorMessage) {
    res.status(301)
  }

  res.render('login', {
    url: req.originalUrl,
    user: req.session.user ? req.session.user : null,
    errorMessage: req.errorMessage ? req.errorMessage : '',
    email: req.email ? req.email : '',
  })
}

async function login(req, res, next) {
  const {email, password} = req.body

  try {
    const {
      rows,
    } = await query(
      'SELECT id, email, password, first_name, last_name FROM "user" WHERE email = $1',
      [email],
    )

    if (!rows.length) {
      req.email = email
      req.errorMessage = 'Invalid email or password.'
      next()
      return
    }

    const {password: passwordHash, ...user} = rows[0]
    const match = await bcrypt.compare(password, passwordHash)

    if (!match) {
      req.email = email
      req.errorMessage = 'Invalid email or password.'
      next()
      return
    }

    req.session.user = user
    res.redirect('/new-article')
  } catch (error) {
    next(error)
  }
}

router.get('/', renderLoginPage)

router.post('/', login, renderLoginPage)

module.exports = router
