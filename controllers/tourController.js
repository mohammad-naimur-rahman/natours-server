const Tour = require('./../models/tourModel')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    //-- Build Query
    //console.log(req.query)

    // 1A - Filteting
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    // 1B - Advanced Filteting
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    )

    let query = Tour.find(JSON.parse(queryString))

    // 2 - Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    }

    // 3 - Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4 - Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments()

      if (skip >= numberOfTours) throw new Error('This page does not exist')
    }

    //-- Execute the query
    const tours = await query

    //-- Send Response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      data: { tour },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(201).json({
      status: 'success',
      data: { tour: updatedTour },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      message: 'success',
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

//-- Filter the results
// const tours = await Tour.find({
//   duration: 5,
//   difficulty: 'easy',
// })

//-- Another way of filtering
// const tours = await Tour.find()
//   .where('duration')
//   .equal(5)
//   .where('difficulty')
//   .equal('easy')
