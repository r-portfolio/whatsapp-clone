import { Firebase } from "./Firebase";

export class Upload {
  /**
   * @param {*} file File.
   * @param {*} from Who is sending.
   * @return {Promise} Upload file.
   */
  static send(file, from) {
    return new Promise((s, f) => {
      // uploading file to Firestore
      let uploadTask = Firebase.hd()
        .ref(from)
        .child(Date.now() + "_" + file.name)
        .put(file);

      uploadTask.on(
        "state_changed",
        e => {
          console.info("upload", e);
        },
        err => {
          f(err);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            s(downloadURL);
          });
        }
      );
    });
  }
}
