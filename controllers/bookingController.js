const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const catchAsync = require('./../utils/catchAsync')
const Tour = require('./../models/tourModel')
const Booking = require('./../models/bookingModel')
const {
  handleGetOne,
  handleGetAll,
  handleCreateOne,
  handleUpdateOne,
  handleDeleteOne
} = require('./../controllers/handlerFactory')

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the current booked tour session
  const tour = await Tour.findById(req.params.tourId)

  //2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  })

  //3) Send the response
  res.status(200).json({
    status: 'success',
    session
  })
})

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query

  if (!tour && !user && !price) return next()

  await Booking.create({ tour, user, price })

  res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking = handleCreateOne(Booking)
exports.getBooking = handleGetOne(Booking)
exports.getAllBookings = handleGetAll(Booking)
exports.updateBooking = handleUpdateOne(Booking)
exports.deleteBooking = handleDeleteOne(Booking)
