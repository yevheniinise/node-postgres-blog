const express = require('express')
const bcrypt = require('bcrypt')
const {query} = require('../db')

const router = express.Router()

function renderRegistrationPage(req, res) {
  res.render('register', {
    url: req.originalUrl,
    user: req.session.user ? req.session.user : null,
    message: req.message ? req.message : '',
    messageType: req.messageType ? req.messageType : '',
  })
}

async function register(req, res, next) {
  const {firstName, lastName, email, password} = req.body

  try {
    const {rowCount} = await query(
      'SELECT email FROM "user" WHERE email = $1;',
      [email],
    )

    if (rowCount) {
      req.message = `The e-mail address ${email} is already in use.`
      req.messageType = 'danger'
      next()
      return
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    await query(
      'INSERT INTO "user"(email, password, first_name, last_name) VALUES($1, $2, $3, $4);',
      [email, hash, firstName, lastName],
    )

    req.message = 'You have been successfully registered.'
    req.messageType = 'success'
    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', renderRegistrationPage)

router.post('/', register, renderRegistrationPage)

module.exports = router
