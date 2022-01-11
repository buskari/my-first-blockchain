const express = require('express')
const app = express()

app.get('/blockchain', (req, res) => {
  // ... return entire blockchain
})

app.post('/transaction', (req, res) => {
  // ... create new transaction
})

app.get('/mine', (req, res) => {
  // ... mine a new block
})


app.listen(3333, () => {
  console.log('Listening on port 3333...')
});