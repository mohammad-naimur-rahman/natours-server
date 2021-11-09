const express = require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

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
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

//-- Error Handler for undeclared routes
app.use(globalErrorHandler)

module.exports = app
