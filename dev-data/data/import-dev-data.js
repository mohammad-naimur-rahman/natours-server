const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')

dotenv.config({ path: './config.env' })

const DB =
  'mongodb+srv://yourNaimur:.qmZGJ.A5-Fvfts@cluster0.avi8n.mongodb.net/natours?retryWrites=true&w=majority&ssl=true'

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
const tours = JSON.parse(fs.readFileSync(__dirname + '/tours.json', 'utf-8'))

// Import Data Into DB
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data Successfully Loaded!')
  } catch (err) {
    console.log(err)
  }
}

// Delete All Data Existed Already
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data Successfully Deleted!')
  } catch (err) {
    console.log(err)
  }
}
