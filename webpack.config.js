const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  optimization: {
    minimize: false,
    // namedModules: true,
    moduleIds: "natural",
  },
  entry: {
    script: `./src/script.js`,
  },
  output: {
    filename: "[name].js",
    path: __dirname,
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: "body",
      template: "./src/index.html",
    }),
  ],
};
