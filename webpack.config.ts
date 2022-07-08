import path from "path";
import { Configuration } from "webpack";
import {} from 'webpack-dev-server';

const config: Configuration = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(tsx|jsx|ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
};
export default config;