// Exportar class criada
export class CameraController {
  constructor(videoEl) {
    this._videoEl = videoEl;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(screenStream => {
        this._screenStream = screenStream;
        this._videoEl.srcObject = screenStream;
        this._videoEl.play();
      })
      .catch(err => {
        console.error(err);
      });
  }

  stop() {
    this._screenStream.getTracks().forEach(track => {
      track.stop();
    });
  }

  // Take a picture

  takePicture(mimeType = "image/png") {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("height", this._videoEl.videoHeight);
    canvas.setAttribute("width", this._videoEl.videoWidth);

    let context = canvas.getContext("2d");

    context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL(mimeType);
  }
}
