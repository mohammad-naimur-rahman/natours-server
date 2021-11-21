const express = require('express')
const { isLoggedIn, protect } = require('../controllers/authController')
const {
  getOverview,
  getTour,
  getLogin,
  getAccount,
  getMyTours
} = require('./../controllers/viewsController')
const { createBookingCheckout } = require('./../controllers/bookingController')

const router = express.Router()

router.get('/', createBookingCheckout, isLoggedIn, getOverview)
router.get('/tour/:slug', isLoggedIn, getTour)
router.get('/login', isLoggedIn, getLogin)
router.get('/me', protect, getAccount)
router.get('/my-tours', protect, getMyTours)

module.exports = router
