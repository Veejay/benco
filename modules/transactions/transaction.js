const { DebitTransaction } = require('./debit')
const { CreditTransaction } = require('./credit')

class FinancialTransaction {
  static create(record) {
    let transaction = Object.is(record.type, 'debit') ? new DebitTransaction(record) : new CreditTransaction(record)
    return transaction
  }
}

module.exports = { FinancialTransaction }