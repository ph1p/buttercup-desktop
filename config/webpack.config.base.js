const HappyPack = require('happypack');
const threadPool = HappyPack.ThreadPool({ size: 4 });
const { join } = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        include: [
          join(__dirname, '../src'),
          join(__dirname, '../node_modules/buttercup-generator')
        ]
      },
      {
        test: /\.(svg|png|ttf|woff|woff2)$/,
        use: 'happypack/loader?id=file',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: 'happypack/loader?id=css'
      }
    ]
  },
  output: {
    path: join(__dirname, '../app/dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss'],
    alias: {
      locales: join(__dirname, '../locales')
    }
  },
  plugins: [
    new HappyPack({
      id: 'css',
      verbose: false,
      loaders: ['style-loader', 'css-loader'],
      threadPool
    }),
    new HappyPack({
      id: 'js',
      verbose: false,
      loaders: ['babel-loader?cacheDirectory'],
      threadPool
    }),
    new HappyPack({
      id: 'file',
      verbose: false,
      loaders: ['file-loader'],
      threadPool
    })
  ],
  externals: ['buttercup-importer', 'zxcvbn', 'dropbox', 'webdav', 'conf']
};
