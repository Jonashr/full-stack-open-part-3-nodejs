const infoRouter = require('express').Router()

const Person = require('../models/person')

infoRouter.get('/', async (req, res) => {
  const persons = await Person.find({})

  if(persons.length > 0) {
    res.send('Phonebook has info for ' + persons.length + ' persons<br>' + new Date())
  } else {
    res.send('Phonebook has info for ' + 0 + ' persons<br>' + new Date())
  }
})

module.exports = infoRouter