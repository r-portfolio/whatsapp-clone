import { ClassEvent } from "../utils/ClassEvent";

export class MicrophoneController extends ClassEvent {
  constructor() {
    super();

    // mimetype standard for recording in google chrome
    this._mimetype = "audio/webm";

    // flag to prevent start recording without the stream being available
    this._available = false;

    navigator.mediaDevices
      .getUserMedia({
        audio: true
      })
      .then(stream => {
        this._available = true;

        this._stream = stream;

        this.trigger("ready", this._stream);
      })
      .catch(err => {
        console.error(err);
      });
  }

  /**
   * @returns { Boolean } Evaluable for recording? true / false
   */
  isAvailable() {
    return this._available;
  }

  /**
   * Stops all audio tracks.
   */
  stop() {
    this._stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  /**
   * Starts recording the microphone.
   */
  startRecorder() {
    if (this.isAvailable()) {
      this._mediaRecorder = new MediaRecorder(this._stream, {
        mimeType: this._mimetype
      });

      // You must save the information sent "in parts" in the correct order
      this._recordedChuncks = [];

      this._mediaRecorder.addEventListener("dataavailable", e => {
        if (e.data.size > 0) this._recordedChuncks.push(e.data);
      });

      // when you stop recording, you should take all the recording pieces
      // and transform into a single file
      this._mediaRecorder.addEventListener("stop", e => {
        // blob = binary large object
        let blob = new Blob(this._recordedChuncks, {
          type: this._mimetype
        });

        let filename = `rec${Date.now()}.webm`;

        let audioContext = new AudioContext();

        let reader = new FileReader();

        reader.onload = e => {
          audioContext.decodeAudioData(reader.result).then(decode => {
            let file = new File([blob], filename, {
              type: this._mimetype,
              lastModified: Date.now()
            });

            this.trigger("recorded", file, decode);
          });
        };

        reader.readAsArrayBuffer(blob);
      });

      this._mediaRecorder.start();
      this.startTimer();
    }
  }

  /**
   * Stops a microphone recording in progress.
   */
  stopRecorder() {
    if (this.isAvailable()) {
      this._mediaRecorder.stop();
      this.stopTimer();
      this.stop();
    }
  }

  /**
   * Starts the audio recording timer.
   */
  startTimer() {
    let start = Date.now();

    this._recordMicrophoneInterval = setInterval(() => {
      this.trigger("recordtimer", Date.now() - start);
    }, 100); // 100 = 10x by second
  }

  /**
   * Stops the audio recording timer.
   */
  stopTimer() {
    clearInterval(this._recordMicrophoneInterval);
  }
}
