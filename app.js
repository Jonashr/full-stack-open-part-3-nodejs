const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const personRouter = require('./controllers/persons')
const infoRouter = require('./controllers/info')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const morgan = require('morgan')

app.use(bodyParser.json())
// For using tiny just remove this comment, for custom use the other one below.
// app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function getParam (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('CCConnected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use('/api/persons', personRouter)
app.use('/api/info', infoRouter)

app.use(middleware.errorHandler)


module.exports = app