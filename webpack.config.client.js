const path = require("path");
const webpack = require("webpack");

const CURRENT_WORKING_DIR = process.cwd();

const webpackConfig = {
  name: "browser",
  mode: "development",
  devtool: "source-map",
  entry: [
    "webpack-hot-middleware/client?reload=true",
    path.join(CURRENT_WORKING_DIR, "/client/main.js"),
  ],
  output: {
    path: path.join(CURRENT_WORKING_DIR, "/dist"),
    filename: "bundle.js",
    publicPath: "/dist/",
  },
  devServer: {
    hot: true,
    static: {
      watch: {
        ignored: ["**/System Volume Information", "**/node_modules"],
      },
    },
  },
  watchOptions: {
    ignored: ["**/System Volume Information"], // Ignora 'System Volume Information'
  },

  module: {
    rules: [
      {
        test: /\.(js|tsx|ts|jsx)?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "react-hot-loader/webpack"],
      },
      {
        test: /\.(ttf|eot|svg|gif|jpg|png|pdf)(\?[\s\S]+)?$/,
        use: "file-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /nnNO/,
      contextRegExp: /@mui\/x-data-grid\/locales/,
    }),
  ],
  devServer: {
    hot: true,
    // ... otras configuraciones
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
    extensions: [".js", ".jsx"],
  },
};

module.exports = webpackConfig;
