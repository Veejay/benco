const chalk = require('chalk')

const {AbstractTransaction} = require('./abstract_transaction')

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

module.exports = {DebitTransaction}