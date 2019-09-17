const errorHandler = (error, request, response, next) => {
  console.log('ERROR NAME', error.name)

  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    console.log(error.message)
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

module.exports = {
  errorHandler
}