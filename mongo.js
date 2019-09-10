const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Give password as arg")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://testuser123:${password}@cluster0-y0p9e.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url,  {useNewUrlParser: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv[3] !== undefined) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    
    person.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })
} else {
    console.log('Phonebook:')
    Person.find({})
    .then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
    mongoose.connection.close()
    })
}

