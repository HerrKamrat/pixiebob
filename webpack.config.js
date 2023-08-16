const path = require('path')

module.exports = {
  name: "index",
  entry: {
      app: './src/index.ts'
  },
  output: {
      path: path.resolve(__dirname, 'docs', 'js'),
      filename: 'index.js'
  },
  resolve: {
      extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  plugins: [

  ],
  module: {
      rules: [{
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
      }]
  },
  mode: 'development'
}