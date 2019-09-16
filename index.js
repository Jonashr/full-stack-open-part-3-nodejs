const express = require('express')
const app = express()
require('dotenv').config()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
// For using tiny just remove this comment, for custom use the other one below.
// app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function getParam (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [

]

const generateId = () => {
  const maxId = persons.length > 0 ?
    Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      if(persons) {
        res.send('Phonebook has info for ' + persons.length + ' persons<br>' + Date(Date.now().toString()))
      } else {
        res.send('Phonebook has info for ' + 0 + ' persons<br>' + Date(Date.now().toString()))

      }
    })
})

app.get('/api/persons', (request, response,) => {
  Person.find({}).then (persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name && !body.number) {
    return response.status(400).json({
      error: 'Content missing.'
    })
  }

  const nameExists = persons.find(person => person.name === body.name)

  if(nameExists) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log('ERROR NAME', error.name)

  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
