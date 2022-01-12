const express = require('express')
const app = express()
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid')

const bitcoin = new Blockchain()
const nodeAddress = uuidv4().split('-').join('')

app.use(express.json())

// get entire blockchain
app.get('/blockchain', (req, res) => {
  res.send(bitcoin)
})

// create a new transaction
app.post('/transaction', (req, res) => {
  const { amount, sender, recipient } = req.body
  const blockIndex = bitcoin.createNewTransacation(amount, sender, recipient)
  
  res.json({
    note: `Transaction will be added in block ${blockIndex}.`
  })
})

// mine a block
app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock()
  const previousBlockHash = lastBlock['hash']
  const currentBLockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  }

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBLockData)
  const hash = bitcoin.hashBlock(previousBlockHash, currentBLockData, nonce)

  bitcoin.createNewTransacation(12.5, '00', nodeAddress)

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash)

  res.json({
    note: 'New block mined successfully',
    block: newBlock
  })
})


app.listen(3333, () => {
  console.log('Listening on port 3333...')
});