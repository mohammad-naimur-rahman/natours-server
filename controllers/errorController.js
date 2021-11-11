const AppError = require('./../utils/appError')

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    console.error('ERROR 💥', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }

    if (error.name === 'CastError')
      error = new AppError(`Invalid ${error.path}: ${error.value}`, 400)

    if (error.code === 11000) error = new AppError('Duplicate field value', 400)

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(el => el.message)
      error = new AppError(`Invalid input data. ${errors.join(', ')}`, 400)
    }

    if (error.name === 'jsonWebTokenError') {
      error = new AppError('Invalid token', 401)
    }

    if (error.name === 'TokenExpiredError') {
      error = new AppError('Token expired', 401)
    }

    sendErrorProd(error, res)
  }
}
