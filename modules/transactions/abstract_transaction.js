const { normalize } = require('./../date/normalize')

class AbstractTransaction {
    constructor(transaction, formatter) {
      const normalizedDate = normalize(transaction.date)
      // The date is provided as the classic French format, Date expects YYYY-mm-dd
      this.date = new Date(normalizedDate)
      const {amount, reference} = transaction
      Object.assign(this, {amount, reference})
    }
    
    get formattedDate() {
      // The time part is discarded, it's irrelevant
      let [date] = this.date.toISOString().split('T')
      return date
    }
  }

  module.exports = {AbstractTransaction}