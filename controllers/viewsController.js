const AppError = require('../utils/appError')
const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')
const Booking = require('./../models/bookingModel')

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from FeatureCollection
  const tours = await Tour.find()
  // 2) Build template

  // 3) Render template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  if (!tour) {
    return next(new AppError('There is no tour with this name', 404))
  }
  // 2) Build template

  // 3) Render template using data from 1)

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  })
})

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in'
  })
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id })
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour)
  const tours = await Tour.find({ _id: { $in: tourIDs } })
  // 3) Render template using data from 2)
  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  })
})
