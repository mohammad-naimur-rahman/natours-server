const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')
const Review = require('./../../models/reviewModel')
const User = require('./../../models/userModel')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE_URI

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to database successfully!')
    deleteData()
    importData()
  })
  .catch(err => console.log(err))

// Read JSON File
const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'))
const tours = JSON.parse(fs.readFileSync(__dirname + '/tours.json', 'utf-8'))
const reviews = JSON.parse(
  fs.readFileSync(__dirname + '/reviews.json', 'utf-8')
)

// Import Data Into DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false })
    await Tour.create(tours)
    await Review.create(reviews)
    console.log('Data Successfully Loaded!')
  } catch (err) {
    console.log(err)
  }
}

// Delete All Data Existed Already
const deleteData = async () => {
  try {
    await User.deleteMany()
    await Tour.deleteMany()
    await Review.deleteMany()
    console.log('Data Successfully Deleted!')
  } catch (err) {
    console.log(err)
  }
}
