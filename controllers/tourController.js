const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const {
  handleDeleteOne,
  handleUpdateOne,
  handleCreateOne,
  handleGetOne,
  handleGetAll
} = require('./handlerFactory')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTours = handleGetAll(Tour)
exports.getTour = handleGetOne(Tour, {
  path: 'reviews',
  select: '-__v'
})
exports.createTour = handleCreateOne(Tour)
exports.updateTour = handleUpdateOne(Tour)
exports.deleteTour = handleDeleteOne(Tour)

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: { stats }
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ])

  res.status(200).json({
    status: 'success',
    data: { plan }
  })
})

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lat, lng] = latlong.split(',')

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if (!distance || !latlng || !unit) {
    next(new AppError('Please provide necessary information', 404))
  }

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude or longitude in the format lat, lng.',
        404
      )
    )
  }

  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { data: tour }
  })
})
