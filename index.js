//express on funktio, jota kutsumalla voidaan luoda muuttujaan app sijoitettava express sovellusta vastaava olio
const express = require('express')
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())


let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

//POST reitti jolla voidaan lisätä uusi numero
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!req.body || !req.body.name ) {
    return res.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number is missing'
    })
  }

  const nameExist = persons.some(p => p.name === body.name)

  if (nameExist) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: String(Math.floor(Math.random() * 100000))
  }

  persons = persons.concat(person)

  res.status(201).json(person)
})
//reitti
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const count = persons.length
  const time = new Date()

  response.send(`
    <p>phonebook has info for ${count} people</p>
    <p>${time}</p>
    `)
})

app.get('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  }else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})