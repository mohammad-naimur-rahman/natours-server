const mongoose = require('mongoose')
const slugify = require('slugify')
//const User = require('./userModel') // For embedding, its needed, for referencing, its not needed

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less than or equal 40 characters'],
      minLength: [10, 'A tour name must be at least 10 characters']
      // This validation example is only for demonstrating the validator package
      // validate: [validator.isAlpha, 'Tour Name can only contain characters'] // custom validator via 3rd party package
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maximum group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'A tour must have a difficulty either: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be between 1.0 and 5.0'],
      max: [5, 'Rating must be between 1.0 and 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: {
        Number,
        default: 0
      }
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'Discount price({VALUE}) should be below regular price',
        // custom validation (own made)
        validator: function (val) {
          // here the `val` is only available when creating a new document
          return val < this.price
        }
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    //-- embedding
    //guides: Array,

    //-- referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

//-- Indexing
tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

//-- Virtual Property
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

//-- Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

//-- Document Middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

//-- Embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromises)
//   next()
// })

//-- Post Middleware: runs after .save() and .create()
// tourSchema.post('save', function (doc, next) {
//   console.log(doc)
//   next()
// })

//-- Query Middleware: runs before .find() and .findOne()
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })

  this.start = Date.now()
  next()
})

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -role'
  })
  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  next()
})

//-- Aggregation Middleware: runs before .aggregate()
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })

  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
