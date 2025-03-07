const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // vstupní bod aplikace
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // soubor, kam se vše zkompiluje
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Zpracuje soubory .js a .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Babel loader pro kompilaci JSX
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Aby Webpack věděl, že hledat i soubory s příponou .jsx
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // použití HTML template
    }),
  ],
  mode: 'development', // nebo 'production', podle potřeby
};
