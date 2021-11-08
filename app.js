const express = require('express')
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

//-- Middlewares
app.use(express.json())

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

//-- Route Handlers
const initial = (req, res) => res.status(200).send('I am on')

app.route('/').get(initial)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

//-- For Undeclared Routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`
  })
})

module.exports = app
