function isValidStringId(id) {
  // check for a string of 24 hex characters
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')
  return !!checkForHexRegExp.test(id)
}

module.exports = {
  isValidStringId,
}
