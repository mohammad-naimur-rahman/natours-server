const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const {
  handleDeleteOne,
  handleUpdateOne,
  handleGetOne,
  handleGetAll
} = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user not logged in
  if (!req.user) {
    return next(new AppError('You are not logged in!', 401))
  }
  // 2) Get user
  const user = await User.findById(req.user.id)
  // 3) Send response
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates', 400))
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email')

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please sign up instead'
  })
}

exports.getUser = handleGetOne(User)
exports.getAllUsers = handleGetAll(User)
// These actions below can be done by only admins
exports.updateUser = handleUpdateOne(User)
exports.deleteUser = handleDeleteOne(User)
