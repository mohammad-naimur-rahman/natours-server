const Review = require('./../models/reviewModal')
const {
  handleDeleteOne,
  handleUpdateOne,
  handleCreateOne,
  handleGetOne,
  handleGetAll
} = require('./handlerFactory')

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id
  next()
}

exports.getAllReviews = handleGetAll(Review)
exports.getReview = handleGetOne(Review)
exports.createReview = handleCreateOne(Review)
exports.updateReview = handleUpdateOne(Review)
exports.deleteReview = handleDeleteOne(Review)
