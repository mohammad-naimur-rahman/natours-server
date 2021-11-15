const express = require('express')
const reviewcontroller = require('../controllers/reviewController')
const authController = require('../controllers/authController')

const { getAllReviews, getReview, createReview, updateReview, deleteReview } =
  reviewcontroller
const { protect, restrictTo } = authController

const router = express.Router({ mergeParams: true }) // to get params from tour routes

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview)

router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview)

module.exports = router
