class Utility {
  static isNullOrEmpty(data) {
    return null === data || undefined === data || "" === data || data.length === 0 || Object.keys(data).length === 0;
  }

  static getAlphabentFromName(name) {
    let shortName;
    let splittedName = name.split(" ");
    if (splittedName.length === 1) {
      shortName = splittedName[0].charAt(0).toUpperCase();
    } else if (splittedName.length > 1) {
      shortName =
        splittedName[0].charAt(0).toUpperCase() + splittedName[splittedName.length - 1].charAt(0).toUpperCase();
    }

    return shortName;
  }

  static formatTime(timeStamp) {
    let date = new Date(timeStamp);
    let amPm = date.getSeconds() < 12 ? "PM" : "AM";
    return `${date.getHours()}: ${date.getMinutes()} ${amPm}`;
  }
}

export default Utility;
