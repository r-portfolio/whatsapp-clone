import { Firebase } from "./../utils/Firebase";
import { Model } from "./Model";

export class User extends Model {
  constructor(id) {
    super();

    if (id) this.getById(id);
  }

  /* -- Getters & Setters -- */
  get name() {
    return this._data.name;
  }
  set name(value) {
    this._data.name = value;
  }

  get email() {
    return this._data.email;
  }
  set email(value) {
    this._data.email = value;
  }

  get photo() {
    return this._data.photo;
  }
  set photo(value) {
    this._data.photo = value;
  }

  get chatId() {
    return this._data.chatId;
  }
  set chatId(value) {
    this._data.chatId = value;
  }
  /* -- end - Getters & Setters -- */

  /**
   * Get a reference for users in Firebase.
   * @return { firebase.firestore.CollectionReference } An instance of CollectionReference.
   */
  static getRef() {
    return Firebase.db().collection("/users");
  }

  /**
   * Returns a Contact reference for a user.
   * @param { String } id
   * @return { Promise } Contacts of the requested user.
   */
  static getContactsRef(id) {
    return User.getRef()
      .doc(id)
      .collection("contacts");
  }

  /**
   * Search the reference for a specified email.
   * @param {String} email
   * @return {firebase.firestore.DocumentReference} An instance of DocumentReference.
   */
  static findByEmail(email) {
    return User.getRef().doc(email);
  }

  /**
   * Searches for a document saved in the database by a specified id.
   * @param {*} id
   * @return {Promise} Document saved in Firebase.
   */
  getById(id) {
    return new Promise((s, f) => {
      // in this method the change change listener is in real time
      User.findByEmail(id).onSnapshot(doc => {
        this.fromJSON(doc.data());

        s(doc);
      });

      /* Method if you want to return the data only in the forward query.
         I will leave here for future reference.
          
          User.findByEmail(id).get().then(doc => {
 
              this.fromJSON(doc.data());
 
              s(doc);
          }).catch(err => {
              f(err);
          });
      */
    });
  }

  /**
   * Saves the data in JSON in Firebase.
   * @return { Promise } Saved data.
   */
  save() {
    return User.findByEmail(this.email).set(this.toJSON());
  }

  /**
   * Adds a contact to a user.
   * @param { User } contact
   * @return { Promise } Contact added.
   */
  addContact(contact) {
    // Obs: Contact email is being converted to base64
    // because it can be used in functions like searching.
    return User.getContactsRef(this.email)
      .doc(btoa(contact.email))
      .set(contact.toJSON());
  }

  /**
   * - Returns a user's contacts.
   * - Notifies who is expecting some change in contacts.
   * @param { String } filter (optional)
   * @return { Promise } Contacts of a user.
   */
  getContacts(filter = "") {
    return new Promise((s, f) => {
      User.getContactsRef(this.email)
        .where("name", ">=", filter)
        .onSnapshot(docs => {
          let contacts = [];

          docs.forEach(doc => {
            let data = doc.data();

            data.id = doc.id;

            contacts.push(data);
          });

          this.trigger("contactschange", docs);

          s(contacts);
        });
    });
  }
}
