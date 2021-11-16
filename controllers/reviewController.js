const Review = require('./../models/reviewModal')
const catchAsync = require('./../utils/catchAsync')
const {
  handleDeleteOne,
  handleUpdateOne,
  handleCreateOne
} = require('./handlerFactory')

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}

  if (req.params.tourId) {
    filter = { tour: req.params.tourId }
  }

  const reviews = await Review.find(filter)

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  })
})

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  })
})

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id
  next()
}

exports.createReview = handleCreateOne(Review)
exports.updateReview = handleUpdateOne(Review)
exports.deleteReview = handleDeleteOne(Review)
