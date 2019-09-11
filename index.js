require('dotenv').config()

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan(':method :url :status :res[content-length] - :response-time ms')

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})


let persons = [
        {
          name: "Ada Lovelace",
          number: "39-44-5323523",
          id: 2
        },
        {
          name: "Dan Abramov",
          number: "12-43-234345",
          id: 3
        },
        {
          name: "Mary Poppendieck",
          number: "39-23-6423122",
          id: 4
        },
          {
          name: "Jonas Horvei",
          number: "13132313",
          id: 5
        }
      
]

const generateId = () => {
  const maxId = persons.length > 0 ? 
    Math.max(...persons.map(n => n.id))
    : 0
    return maxId + 1
}

app.get('/info', (req, res) => {
  console.log("Current date" + Date(Date.now().toString()))
  res.send("Phonebook has info for " + persons.length + " people<br/><br />" + Date(Date.now().toString()))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then (persons => {
    response.json(persons.map(person => person.toJSON()))
  })
}) 

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON())
  })
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  // if(person) {

  // } else {
  //   response.status(400).end()
  // }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

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

    persons = persons.concat(person)


    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   persons = persons.filter(person => person.id !== id)

   response.status(204).end

})

const PORT = process.env.PORT || 3001  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
