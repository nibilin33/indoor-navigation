const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
function getPages() {
  const pages = path.resolve(__dirname, "src");
  const dirs = fs.readdirSync(pages);
  let pageConfig = {};
  let plugins = [];
  dirs.forEach((name) => {
    const stat = fs.lstatSync(path.join(pages, name));
    if (stat.isDirectory()) {
      pageConfig[name] = path.join(pages, `${name}/index.js`);
      plugins.push(
        new HtmlWebpackPlugin({
          template: path.join(pages, `${name}/index.html`),
          filename: `${name}.html`,
          chunks: [name],
          inject: "body",
        })
      );
    }
  });
  return {
    entry: pageConfig,
    plugins,
  };
}
const pageConfig = getPages();
module.exports = {
  entry: pageConfig.entry,
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "docs"),
    crossOriginLoading: "anonymous",
    publicPath: "/indoor-navigation",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "docs"),
      publicPath: "/indoor-navigation",
    },
    compress: true,
    port: 9004,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  entry: pageConfig.entry,
  plugins: [
    ...pageConfig.plugins,
    new CopyPlugin({
      patterns: [{ from: "public", to: "./" }],
    }),
  ],
};
