const express = require('express')
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourPhotos
} = require('./../controllers/tourController')
const { protect, restrictTo } = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes')

const router = express.Router()

//-- To transfer routes from tour routes to review routes
router.use('/:tourId/reviews', reviewRouter)

router.route('/tour-stats/').get(getTourStats)
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)
router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)

router.route('/distances/:lalng/unit/:unit').get(getDistances)

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour)
router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourPhotos,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router
