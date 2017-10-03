// const FinancialTransaction = require('financial_transation')
//const BankExtractParser = require('bank_statement_parser')
const fs = require('fs')
const STATEMENT_PATH = './statement.txt'
const chalk = require('chalk')

// const transactions = new TransactionCollection(parser.transactions.map(transaction => {
//   return FinancialTransaction.create(transaction)
// }))

class BankExtractParser {
  constructor() {
  }

  async parse(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {encoding: 'latin1', flag: 'r'}, async (error, contents) => {
        if (error) {
          reject(error)
        } else {
          const transactions = await Promise.all(contents.split(/\r\n\+-+\+\r\n/).map(async record => {
            const parser = new BankTransactionParser(record)
            const transaction = await parser.parse()
            return transaction
          }))
          console.log(transactions)
        }
      })
    })
  }
}

class BankTransactionParser {
  constructor(transaction) {
    this.transaction = transaction
  }

  async parse() {
    return new Promise(async (resolve, reject) => {
      const rows = await Promise.all(this.transaction.split("\r\n").map(async row => {
        const parser = new BankTransactionRowParser(row)
        const data = await parser.parse()
        return data
      }))
      resolve(rows)
    })
  }

}

class BankTransactionRowParser {
  constructor(row) {
    this.row = row
  }

  async parse() {
    return new Promise((resolve, reject) => {
      if(/^Date/.test(this.row)) {
        // Showing weakness here buddy, come on...
        const date = this.row.split(/:\s+/)[1].trim()
        resolve({date})
      } else {
        if (/^Libellé/.test(this.row)) {
          const reference = this.row.split(/:\s+/)[1].trim()
          resolve({reference})
        } else {
          if (/^Débit/.test(this.row)) {
            const amount = this.row.split(/:\s+/)[1].trim()
            
            resolve({type: "debit", amount: parseFloat(amount.replace(/,/, '.')).toFixed(2)})
          } else {
            if (/^Crédit/.test(this.row)) {
              const amount = this.row.split(/:\s+/)[1].trim()
              resolve({type: "credit", amount: parseFloat(amount.replace(/,/, '.')).toFixed(2)})
            } else {
              resolve({})
            }
          }
        }
      }
    })
  }
}

class TransactionCollection {
  constructor(transactions) {
    this.transactions = transactions
  }

  get debits() {
    return this.transactions.filter(transaction => {
      return transaction instanceof DebitTransaction
    })
  }

  get credits() {
    return this.transactions.filter(transaction => {
      return transaction instanceof CreditTransaction
    })
  }

  static where(criteria) {
    this.transactions.filter(transaction => {
      return transaction.matches(criteria)
    })
  }
}

class FinancialTransaction {
  constructor(transaction, formatter) {
    this.date = Date.parse(transaction.date)
    this.amount = transaction.amount
    this.reference = formatter.format(transaction.reference)
  }

  get formattedDate() {
    const year = this.date.getFullYear()
    const month = this.date.getMonth()
    const day = this.date.getDay()
    const hours = this.date.getHours()
    const minutes = this.date.getMinutes()
    const seconds = this.date.getSeconds()
    return `${year}-${month}-${day} ${hour}-${minutes}-${seconds}`
  }
}

class ReferenceFormatter {
  constructor() {
    //
    this.mapping = JSON.parse(fs.readFileSync('mapping.json'))
  }

  format(reference) {
    return this.mapping[reference].trim()
  }
}

class DebitTransaction extends FinancialTransaction {
  constructor(transaction) {
    super(transaction)
    this.amount = -transaction.amount
  }

  toString() {
    return `${this.formattedDate}: Spent ${amount}\U+20A0 at ${reference}`
  }
}

class CreditTransaction extends FinancialTransaction {
  constructor(transaction) {
    super(transaction)
  }

  toString() {
    return `${this.formattedDate}: Received ${amount}\U+20A0 from ${reference}`
  }
}


const parser = new BankExtractParser()
const main = async () => {
  try {
    const rows = await parser.parse(STATEMENT_PATH)
    console.log(rows.join(chalk.blue("\n============\n")))
  } catch(error) {
    console.error(error)
  }
}

main()