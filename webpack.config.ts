const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require('webpack-shell-plugin');
require('dotenv').config()
const {NODE_ENV = 'production'} = process.env;
console.log("🚀🚀🚀🚀 NODE_ENV", NODE_ENV)

module.exports = {
  entry: ["webpack/hot/poll?100", "/src/app.ts"], 
  output: {
    path: path.join(__dirname, "build"),
    filename: "app.js"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    mainFields: ['browser', 'module', 'main'],
  },
  watch: NODE_ENV === 'development' ? true : false,
  mode: NODE_ENV,
  target: "node",
  externals: [
    nodeExternals({
      whitelist: ["webpack/hot/poll?100"]
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin(),
  new WebpackShellPlugin({
    onBuildEnd: ['npm run run:dev']})
  ],

};