import { Model } from "./Model";
import { Firebase } from "../utils/Firebase";

export class Chat extends Model {
  constructor() {
    super();
  }

  /* -- Getters & Setters -- */
  get users() {
    return this._data.users;
  }
  set users(value) {
    this._data.users = value;
  }

  get timeStamp() {
    return this._data.timeStamp;
  }
  set timeStamp(value) {
    this._data.timeStamp = value;
  }
  /* -- End - Getters & Setters -- */

  /**
   * Returns an instance of the collection `chats`.
   * @return An instance of `CollectionReference`.
   */
  static getRef() {
    return Firebase.db().collection("/chats");
  }

  /**
   * Search for a chat that contains the specified ids (emails).
   * @param { String } meEmail  Email from the host user.
   * @param { String } contactEmail  Conversation contact email.
   * @return { Promise }  Search result.
   */
  static find(meEmail, contactEmail) {
    // Obs: You need to convert email to base64 to avoid complications with "@" and ".".
    return Chat.getRef()
      .where(btoa(meEmail), "==", true)
      .where(btoa(contactEmail), "==", true)
      .get();
  }

  /**
   * Creates a chat between two users with the specified ids (emails).
   * @param { String } meEmail Email from the host user.
   * @param { String } contactEmail Conversation contact email.
   * @return { Promise } Chat created.
   */
  static create(meEmail, contactEmail) {
    return new Promise((s, f) => {
      let users = {};

      users[btoa(meEmail)] = true;
      users[btoa(contactEmail)] = true;

      Chat.getRef()
        .add({
          users,
          timeStamp: new Date()
        })
        .then(doc => {
          Chat.getRef()
            .doc(doc.id)
            .get()
            .then(chat => {
              s(chat);
            })
            .catch(err => {
              f(err);
            });
        })
        .catch(err => {
          f(err);
        });
    });
  }

  /**
   * Create a chat if it does not exist.
   * @param { String } meEmail Email from the host user.
   * @param { String } contactEmail Conversation contact email.
   * @return { Promise }  A new chat created or the existing chats.
   */
  static createIfNotExists(meEmail, contactEmail) {
    return new Promise((s, f) => {
      Chat.find(meEmail, contactEmail)
        .then(chats => {
          if (chats.empty) {
            Chat.create(meEmail, contactEmail).then(chat => {
              s(chat);
            });
          } else {
            chats.forEach(chat => {
              s(chat);
            });
          }
        })
        .catch(err => {
          f(err);
        });
    });
  }
}
