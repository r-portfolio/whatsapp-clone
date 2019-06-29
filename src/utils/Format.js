export class Format {
  /**
   * @param {String} text Text in the css id pattern. Ex: # my-id
   * @return {String} Text formatted in camelCase.
   */
  static getCamelCase(text) {
    let div = document.createElement("div");

    div.innerHTML = `<div data-${text}="id"></div>`;

    return Object.keys(div.firstChild.dataset)[0];
  }

  /**
   * @param {Date} duration
   * @return {String} Time formatted for 0:00:00 (if ouver hours) or 0:00.
   */
  static toTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if (hours > 0) {
      return `${hours}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  /**
   * @param {*} timeStamp Firebase TimeStamp.
   * @return {String} Formatted time.
   */
  static timeStampToTime(timeStamp) {
    return timeStamp && typeof timeStamp.toDate === "function"
      ? Format.dateToTime(timeStamp.toDate())
      : "";
  }

  /**
   * @param {*} date Date.
   * @return {String} Data formatted with locale.
   */
  static dateToTime(date, locale = "pt-BR") {
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
}
