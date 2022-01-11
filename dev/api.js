const express = require('express')
const app = express()
const Blockchain = require('./blockchain')
const ethereum = new Blockchain()

app.use(express.json())

app.get('/blockchain', (req, res) => {
  res.send(ethereum)
})

app.post('/transaction', (req, res) => {
  // .. create new transaction
})

app.get('/mine', (req, res) => {
  // ... mine a new block
})


app.listen(3333, () => {
  console.log('Listening on port 3333...')
});