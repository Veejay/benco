// Node modules
const fs = require('fs')

// Custom modules
const { BankTransactionParser } = require('./bank_transaction')
const { FinancialTransaction } = require('./../transactions/transaction')
const { TransactionCollection } = require('./../transactions/transaction_collection')

const readStatement = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'latin1', flag: 'r' }, (error, contents) => {
      if (error) {
        reject(error)
      } else {
        resolve(contents)
      }
    })
  })
}

class BankExtractParser {
    constructor() {
    }
  
    async parse(path) {
      return new Promise((resolve, reject) => {
        readStatement(path).then(async contents => {
          const TRANSACTION_SEPARATOR = /\r\n\+-+\+\r\n/
          const data = contents.split(TRANSACTION_SEPARATOR)
          const cleanData = data.slice(1, data.length - 2)
          const rows = await Promise.all(cleanData.map(async record => {
            const parser = new BankTransactionParser(record)
            const transaction = await parser.parse()
            return transaction
          }))
          const transactions = new TransactionCollection(rows)
          resolve(transactions)
        }).catch(reject)
      })
    }
  }
  
  

  module.exports = {BankExtractParser}