const path = require('path');

const mode = process.env.BUILD_MODE || 'development';

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: mode === 'development' ? 'hsync-wc.js' : 'hsync-wc.min.js'
  },
  mode,
  resolve: {
    alias: {
    }
  },
  node: {
    global: true,
  }
};