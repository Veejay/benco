class BankTransactionRowParser {
    constructor(row) {
      this.row = row
    }
  
    async parse() {
      const SEPARATOR = /:\s+/
      return new Promise((resolve, reject) => {
        if (/^Date/.test(this.row)) {
          // Showing weakness here buddy, come on...
          const date = this.row.split(SEPARATOR)[1].trim()
          resolve({ date })
        } else {
          if (/^Libellé/.test(this.row)) {
            const reference = this.row.split(SEPARATOR)[1].trim()
            resolve({ reference })
          } else {
            if (/^Débit/.test(this.row)) {
              const amount = this.row.split(SEPARATOR)[1].trim()
              resolve({ type: "debit", amount: parseFloat(amount.replace(/,/, '.')).toFixed(2) })
            } else {
              if (/^Crédit/.test(this.row)) {
                const amount = this.row.split(SEPARATOR)[1].trim()
                resolve({ type: "credit", amount: parseFloat(amount.replace(/,/, '.').replace(/\s+/, '')).toFixed(2) })
              } else {
                resolve({})
              }
            }
          }
        }
      })
    }
  }

module.exports = {BankTransactionRowParser} 