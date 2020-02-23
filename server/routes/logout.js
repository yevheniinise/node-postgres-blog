const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  if (req.session.user) {
    req.session.destroy(() => {
      res.redirect('/')
    })
    return
  }

  res.redirect('/login')
})

module.exports = router
