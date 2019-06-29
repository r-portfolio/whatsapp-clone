export class Base64 {
  /**
   * @param {*} urlBase64
   * @return {String} Mimetype;
   */
  static getMimetype(urlBase64) {
    let regex = /^data:(.+);base64,(.*)$/;
    let result = urlBase64.match(regex);
    /* Obs:
        In this case, the result is separated into a 3-position array:
        0 - full string (in this case, the b64 of the photo);
        1 - first part found. (. +) - for example "image / png"
        2 - second part found. (. *) - the rest of the string in b64
        
        console.log(result);
    */
    return result[1]; // image/png
  }

  static toFile(urlBase64) {
    let mimeType = Base64.getMimetype(urlBase64);
    let ext = mimeType.split("/")[1]; // png
    let filename = `file_${Date.now()}.${ext}`; // ex.: camera_00:00:00.png

    return fetch(urlBase64)
      .then(res => {
        return res.arrayBuffer();
      })
      .then(buffer => {
        return new File([buffer], filename, { mime: mimeType });
      });
  }
}
