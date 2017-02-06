const path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  publicPath: path.join(__dirname, '../public'),
  buildPath: path.join(__dirname, '../build'),
  server: {
    front: {
      contentBase: './public',
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: '0.0.0.0',
      port: 3000,
    },
    back: {
      host: '0.0.0.0',
      port: 3004,
    },
  },
};
