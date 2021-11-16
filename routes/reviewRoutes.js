const express = require('express')
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router({ mergeParams: true }) // to get params from tour routes

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview)

router
  .route('/:id')
  .get(getReview)
  .patch(protect, restrictTo('user'), updateReview)
  .delete(protect, restrictTo('user', 'admin'), deleteReview)

module.exports = router
