const express = require('express')
const app = express()
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid')
const port = process.argv[2]
const axios = require('axios').default

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

// register and broadcast a node to the network 
app.post('/register-and-broadcast-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotPresent = bitcoin.networkNodes.indexOf(newNodeUrl === -1)
  
  if (nodeNotPresent) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  bitcoin.networkNodes.forEach(networkNodeUrl => {    
    const regNodesPromises = []
    
    regNodesPromises.push(
      axios.post(networkNodeUrl + 'register-node', {
        newNodeUrl
      })
    );

    Promise.all(regNodesPromises)
    .then(data => {
      return axios.post('register-nodes-bulk', {
        allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
      })
      .then(data => {
        res.json({
          message: 'New node registered with network successfully.'
        })
      })
    })
  })
})

// register a node with the network (the other nodes accepts the new node)
app.post('/register-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotPresent = bitcoin.networkNodes.indexOf(newNodeUrl === -1)
  const notCurrentNode = newNodeUrl !== bitcoin.currentNodeUrl;
  if (nodeNotPresent && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  res.json({
    message: 'New node register successfuly.'
  })
})

// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {

})

app.listen(port, () => {
  console.log(`Listening on ${port} ...`)
});