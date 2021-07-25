const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('body', (req, res) => {
  return [
    JSON.stringify(req.body)
  ]
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Agenda</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const cantidad = persons.length
  const date = new Date()
  console.log(date)
  console.log(cantidad)
  response.send(`Phonebook has info for ${cantidad} people` + '<br/><br/>' + date)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  if (!person || !person.name || !person.number) {
    response.status(400).json({

      error: 'name or number are missing'
    }).end()
  } else {
    const personRepetido = persons.find(per => per.name === person.name)
    if (personRepetido) {
      response.status(400).json({
        error: 'name must be unique'
      }).end()
    } else {
      const newPerson = {
        id: maxId + 1,
        name: person.name,
        number: person.number
      }

      persons = [...persons, newPerson]

      response.json(newPerson)
    }
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
