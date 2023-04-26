const path = require("path");

module.exports = {
  entry: {
    index: "./es6/main.js",
    argv: "./es6/argv.js",
  },
  output: {
    path: "./static",
    filename: "[name].bundle.js",
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, "es6"),
        loader: "babel-loader",
      },
    ],
  },
};
