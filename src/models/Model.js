import { ClassEvent } from "../utils/ClassEvent";

export class Model extends ClassEvent {
  constructor() {
    super();

    this._data = {};
  }

  /**
   *  Receives data in JSON.
   * - Creates an object with this data.
   * - Sends a trigger to the datachange event with the JSON created.
   * @param { JSON } json
   */
  fromJSON(json) {
    this._data = Object.assign(this._data, json);
    this.trigger("datachange", this.toJSON());
  }

  /**
   *  Generates a JSON with the data of a model.
   * @return { JSON } JSON with the data.
   */
  toJSON() {
    return this._data;
  }
}
