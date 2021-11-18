const path = require('path')
const WebpackUserscript = require('webpack-userscript')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: 'production',
  entry: {
    bot: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    filename: 'margo-[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  devServer: {
    static: './dist',
    hot: false,
    client: {
      logging: 'none',
    },
  },
  plugins: [
    new WebpackUserscript({
      headers ({ name }) {
        return {
          name: name.split('/')[1],
          version: '[version]-build.[buildNo]',
          match: 'https://fobos.margonem.pl/',
        }
      },
      pretty: false,
      proxyScript: {
        baseUrl: 'http://127.0.0.1:8080',
        filename: 'margo-bot.proxy.user.js',
        enable: true,
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
      test: /\.html$/,
      exclude: /node_modules/,
      use: {
          loader: 'html-loader'
      }
    }]
  }
}
