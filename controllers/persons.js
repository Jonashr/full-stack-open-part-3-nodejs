const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', async (request, response, next) => {
  try {
    const persons = await Person.find({})
    return response.status(200).json(persons) 
  } catch(error) {
    next(error)
  }
})

personRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const person = await Person.findById(id)

    if(person) {
      return response.json(person)
    } else {
      return response.status(404).json({ message: `Person with id ${id} does not exist.` })
    }
  } catch(error) {
    next(error)
  }
})


personRouter.post('/', async (request, response, next) => {
  const body = request.body

  if(!body.name && !body.number) {
    return response.status(400).json({ message: 'Missing name / Number in request.' })
  }

  try {
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    await person.save()

    return response.status(201).json(person)
  } catch(error) {
    next(error)
  }
})

personRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  const { id } = request.params

  try {
    if(!person.name && !person.number) {
      return response.status(400).json({ message: 'Missing name / Number in request.' })
    }

    const updatedPerson = await Person.findByIdAndUpdate(id, person,  { new: true })

    if(!updatedPerson) {
      return response.status(404).json({ message: 'User could not be updated as the user does not exist'})
    }
    return response.status(200).json(updatedPerson)
  } catch(error) {
    next(error)
  }
})

personRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    await Person.findByIdAndRemove(id)
    return response.status(204).end()
  } catch(error) {
    next(error)
  }
})

module.exports = personRouter