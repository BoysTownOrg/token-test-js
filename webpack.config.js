const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "jspsych/main.js",
  plugins: [
    new HtmlWebpackPlugin({
      template: "jatos-template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
