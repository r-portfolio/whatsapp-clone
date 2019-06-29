export class ClassEvent {
  constructor() {
    this._events = {};
  }

  /**
   * @param { String } eventName Name the event.
   * @param { Function } fn Callback function.
   */
  on(eventName, fn) {
    if (!this._events[eventName]) this._events[eventName] = new Array();

    this._events[eventName].push(fn);
  }

  /**
   * Creates a trigger for listening for specific events.
   *
   * - Accepts the first parameter as the name {String} of an event and the parameters
   *  consecutive as arguments, which will be executed if they are functions.
   */
  trigger() {
    let args = [...arguments];
    let eventName = args.shift();

    // in this case will always pass the name of the event as last
    // list parameter sent
    args.push(new Event(eventName));

    if (this._events[eventName] instanceof Array) {
      this._events[eventName].forEach(fn => {
        fn.apply(null, args);
      });
    }
  }
}
