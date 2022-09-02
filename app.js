const path = require('path') // Core node module
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// Run the function to make the connection to the DB which has been imported
connectDB()
 
const app = express()

// Body parser
app.use(express.urlencoded({ extended: false})) // get better understanding of this two
app.use(express.json())

// Method override
app.use(methodOverride(function (req, res){
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Handlebars helpers
const {formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI // This stores your session so you dont have to login everytime 
    })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next){
  res.locals.user = req.user || null
  next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public'))) // Define the path to the public folder

// Routes
app.use('/', require('./routes/index.js'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 8000
 
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
)
