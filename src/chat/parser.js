class Parser {
  parse(name, message) {
    // TODO: Get the last parent UUID and pass it here.
    return {
      isCigEmp: this._isCIGEmployee(name),
      name: name,
      message: message
    }
  }

  /**
   * In the future check against a cached list of verified CIG employees.
   * For now just use a brain dead simple REGEX detection
   */
  _isCIGEmployee(name) {
    const pattern = /(^cig)/ig
    return pattern.exec(name) !== null;
  }
}

module.exports = Parser;
