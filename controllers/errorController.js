const AppError = require('./../utils/appError')

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  })
}

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }
    console.error('ERROR 💥', err)
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later'
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    error.message = err.message
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

    sendErrorProd(error, req, res)
  }
}
