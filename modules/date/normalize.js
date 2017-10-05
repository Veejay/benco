const normalize = (date) => {
  const regex = /^([0-9]{2})\/([0-9]{2})/
  // Pseudo capture groups, JS doesn't have support for them (October 2017)
  const captureGroups = { day: 1, month: 2 }
  const result = regex.exec(date)
  // We have to hardcode 2017 in there for now, since Crédit Agricole doesn't provide the year (yeah...)
  return `2017-${result[captureGroups.month]}-${result[captureGroups.day]}`
}

module.exports = { normalize }

