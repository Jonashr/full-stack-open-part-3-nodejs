const infoRouter = require('express').Router()

const Person = require('../models/person')

infoRouter.get('/', (req, res) => {
  Person.find({})
    .then(persons => {
      if(persons) {
        res.send('Phonebook has info for ' + persons.length + ' persons<br>' + Date(Date.now().toString()))
      } else {
        res.send('Phonebook has info for ' + 0 + ' persons<br>' + Date(Date.now().toString()))

      }
    })
})

module.exports = infoRouter