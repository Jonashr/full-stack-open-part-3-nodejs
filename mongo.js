const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url,  { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv[2] !== undefined) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  })

  person.save().then(result => {
    console.log(result)
    mongoose.connection.close()
  })
} else {
  Person.find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}

