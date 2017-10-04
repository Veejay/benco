const fs = require('fs')
const {BankTransactionRowParser} = require('./bank_transaction_row_parser')
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
          const data = contents.split(/\r\n\+-+\+\r\n/)
          const cleanData = data.slice(1, data.length - 2)
          const transactions = await Promise.all(cleanData.map(async record => {
            const parser = new BankTransactionParser(record)
            const transaction = await parser.parse()
            return transaction
          }))
          resolve(transactions)
        }).catch(reject)
      })
    }
  }
  
  class BankTransactionParser {
    constructor(transaction) {
      this.transaction = transaction
    }
  
    async parse() {
      return new Promise(async (resolve, reject) => {
        const lines = this.transaction.split(/(\r\n)+/)
        const rows = await Promise.all(lines.map(async row => {
          const parser = new BankTransactionRowParser(row.trim())
          const data = await parser.parse()
          return data
        }))
        const transaction = rows.reduce((memo, row) => { return Object.assign(memo, row) }, {})
        resolve(transaction)
      })
    }
  
  }

  module.exports = {BankExtractParser}