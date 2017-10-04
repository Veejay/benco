// Node modules
const chalk = require('chalk')

// Custom modules
const {BankExtractParser} = require('./modules/bank_extract_parser')

// Constants
const STATEMENT_PATH = './statement.txt'

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

const normalize = date => {
  const regex = /^([0-9]{2})\/([0-9]{2})/
  const captureGroups = {day: 1, month: 2}
  const result = regex.exec(date)
  return `2017-${result[captureGroups.month]}-${result[captureGroups.day]}`
}

class AbstractTransaction {
  constructor(transaction, formatter) {
    const normalizedDate = normalize(transaction.date)
    this.date = new Date(normalizedDate)
    this.amount = transaction.amount
    this.reference = transaction.reference
  }
  
  get formattedDate() {
    return this.date.toISOString().split('T')[0]
  }
}

class ReferenceFormatter {
  constructor() {
    this.mapping = JSON.parse(fs.readFileSync('mapping.json'))
  }

  format(reference) {
    return this.mapping[reference].trim()
  }
}

class DebitTransaction extends AbstractTransaction {
  constructor(transaction) {
    
    super(transaction)
    this.amount = transaction.amount
  }

  get computedAmount() {
    return -(this.amount)
  }

  toString() {
    return `${this.formattedDate}: Spent ${chalk.white.bgRed.bold(this.amount + '€')} at ${chalk.white.bgBlue(this.reference)}`
  }
}

class CreditTransaction extends AbstractTransaction {
  constructor(transaction) {
    super(transaction)
  }

  get computedAmount() {
    return this.amount
  }

  toString() {
    return `${this.formattedDate}: Received ${chalk.white.bgGreen(this.amount + '€')} from ${chalk.white.bgBlue(this.reference)}`
  }
}

class FinancialTransaction {
  static create(record) {
    let transaction = Object.is(record.type, 'debit') ? new DebitTransaction(record) : new CreditTransaction(record)
    return transaction
  }
}

const parser = new BankExtractParser()
const main = async function () {
  try {
    const rows = await parser.parse(STATEMENT_PATH)
    const transactions = rows.map(row => {
      const transaction = FinancialTransaction.create(row)
      return transaction
    })
    const collection = new TransactionCollection(transactions)
    const bigTransactions = collection.debits.filter(transaction => {
      return transaction.amount >= 600.0
    })
    console.log(bigTransactions.map(transaction => {
      return transaction.toString()
    }).join("\n"))
  } catch (error) {
    console.error(error)
  }
}

main()
