// Custom modules
const {BankExtractParser} = require('./modules/parsing/bank_extract')

// Constants
const STATEMENT_PATH = './statement.txt'

const main = async function () {
  try {
    const parser = new BankExtractParser()    
    const transactions = await parser.parse(STATEMENT_PATH)
    const bigTransactions = transactions.debits.filter(transaction => {
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
