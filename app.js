const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personRouter = require('./controllers/persons')
const infoRouter = require('./controllers/info')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function getParam (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

mongoose.connect(config.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to MongoDB instance')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use('/api/persons', personRouter)
app.use('/api/info', infoRouter)

app.use(middleware.errorHandler)


module.exports = app