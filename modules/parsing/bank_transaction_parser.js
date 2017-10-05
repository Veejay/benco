const {BankTransactionRowParser} = require('./bank_transaction_row_parser')

const LINE_SEPARATOR = new RegExp('(\r\n)+')

class BankTransactionParser {
  constructor(transaction) {
    this.transaction = transaction
  }

  async parse() {
    return new Promise(async (resolve, reject) => {
      const lines = this.transaction.split(LINE_SEPARATOR)
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

module.exports = {BankTransactionParser}