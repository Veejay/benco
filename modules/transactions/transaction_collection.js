const { DebitTransaction } = require('./debit')
const { CreditTransaction } = require('./credit')
const { FinancialTransaction } = require('./transaction')

class TransactionCollection {
  constructor(transactions) {
    this.transactions = transactions.map(row => {
      const transaction = FinancialTransaction.create(row)
      return transaction
    })
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
      // NOTE: matches is not implemented on transactions
      // This is a stub reflecting what the API should ideally look like
      return transaction.matches(criteria)
    })
  }
}

module.exports = {TransactionCollection}
