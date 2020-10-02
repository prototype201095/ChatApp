class Utility {
  static isNullOrEmpty(data) {
    return null === data || undefined === data || "" === data || data.length === 0 || Object.keys(data).length === 0;
  }
}

module.exports = Utility;
