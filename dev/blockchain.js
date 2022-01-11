const sha256 = require('sha256')

class Blockchain {
  constructor() {
    this.chain = []
    this.pendingTransactions = []
  }

  createNewBlock (nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1, 
      timeStamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      previousBlockHash,
      hash
    }
  
    this.pendingTransactions = []
    this.chain.push(newBlock)
  
    return newBlock
  }

  getLastBlock () {
    return this.chain[this.chain.length - 1]
  }

  createNewTransacation (amount, sender, recipient) {
    const newTransacation = {
      amount,
      sender,
      recipient
    }

    this.pendingTransactions.push(newTransacation)
    
    return this.getLastBlock()['index'] + 1
  }

  hashBlock (
    previousBlockHash,
    currentBLockData,
    nonce
  ) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBLockData)
    return sha256(dataAsString)
  }

  proofOfWork() {
    const previousBlockHash = this.getLastBlock()['previousBlockHash']
    const currentBLockData = JSON.stringify(this.pendingTransactions)
    
    let nonce =  0
    let hash = this.hashBlock(previousBlockHash, currentBLockData, nonce)

    while (hash.slice(0, 4) !== '0000') {
      nonce++
      hash = this.hashBlock(previousBlockHash, currentBLockData, nonce)
    }

    return nonce
  }
}

module.exports = Blockchain