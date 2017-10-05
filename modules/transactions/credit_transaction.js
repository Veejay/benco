const chalk = require('chalk')

const {AbstractTransaction} = require('./abstract_transaction')

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

module.exports = {CreditTransaction}