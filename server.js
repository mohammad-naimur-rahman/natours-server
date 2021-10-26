const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE_URI

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database successfully!')
  })
  .catch(err => console.log(err))

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Listening to port ${port}`))
