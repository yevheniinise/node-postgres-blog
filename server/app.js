const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const PGSession = require('connect-pg-simple')(session)
require('dotenv').config()

const {pool} = require('./db')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const newArticleRouter = require('./routes/new-article')
const indexRouter = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    res.type('image/x-icon')
    res.status(301)
    res.end()
    return
  }
  next()
})

app.use(morgan('dev'))

app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(
  session({
    store: new PGSession({
      pool,
      tableName: 'session',
    }),
    key: 'session_id',
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60000,
    },
  }),
)

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/new-article', newArticleRouter)
app.use('/', indexRouter)

if (process.env.NODE_ENV === 'production') {
  /* eslint-disable no-unused-vars */
  app.use((err, req, res, next) => {
    const data = {
      url: req.originalUrl,
      user: req.session.user ? req.session.user : null,
    }
    if (typeof err === 'string') {
      res
        .status(404)
        .render('error', {...data, status: 400, message: 'Bad Request'})
    } else {
      res.status(500).render('error', {
        ...data,
        status: 500,
        message: 'Internal Server Error',
      })
    }
  })
}

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`App is listening on port: ${port}`)
})
