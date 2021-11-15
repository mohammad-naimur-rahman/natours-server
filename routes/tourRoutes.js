const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes')

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = tourController
const { protect, restrictTo } = authController

const router = express.Router()

//-- To transfer routes from tour routes to review routes
router.use('/:tourId/reviews', reviewRouter)

router.route('/tour-stats/').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/top-5-cheap').get(aliasTopTours, getAllTours)
router.route('/').get(protect, getAllTours).post(createTour)
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router
