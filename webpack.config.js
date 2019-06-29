// Configuration

// help resolve path absolute
const path = require("path");

module.exports = {
  // file main app.js
  entry: {
    app: "./src/app.js",
    "pdf.worker": "pdfjs-dist/build/pdf.worker.entry.js"
  },
  output: {
    // compilation js
    filename: "[name].bundle.js",
    path: path.join(__dirname, "dist/js"),
    publicPath: "dist"
  }
};
