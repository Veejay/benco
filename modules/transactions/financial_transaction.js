const { DebitTransaction } = require('./debit_transaction')
const { CreditTransaction } = require('./credit_transaction')

class FinancialTransaction {
  static create(record) {
    let transaction = Object.is(record.type, 'debit') ? new DebitTransaction(record) : new CreditTransaction(record)
    return transaction
  }
}

module.exports = { FinancialTransaction }