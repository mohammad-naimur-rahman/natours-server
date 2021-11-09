const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down the server...')
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE_URI

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to database successfully!'))

const port = process.env.PORT || 8000

const server = app.listen(port, () => console.log(`Listening to port ${port}`))

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down the server...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
