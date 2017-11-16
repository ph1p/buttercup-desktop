const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const HappyPack = require('happypack');
const threadPool = HappyPack.ThreadPool({ size: 4 });

module.exports = merge(baseConfig, {
  devtool: false,

  entry: {
    main: resolve(__dirname, '../src/renderer/index'),
    fileManager: resolve(__dirname, '../src/renderer/file-manager')
  },

  output: {
    publicPath: '../dist/'
  },

  module: {
    rules: [
      {
        test: /\.global\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'happypack/loader?id=css',
          use: ['happypack/loader?id=sass']
        })
      },

      {
        test: /^((?!\.global).)*\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'happypack/loader?id=css',
          use: ['happypack/loader?id=sass']
        })
      }
    ]
  },

  node: {
    __dirname: false
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin({
      parallel: true,
      exclude: /\/node_modules/,
      uglifyOptions: {
        ecma: 8,
        mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: false,
          if_return: true,
          join_vars: true,
          drop_console: true
        },
        output: {
          comments: false,
          beautify: false
        }
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new HappyPack({
      id: 'css',
      verbose: false,
      loaders: ['style-loader'],
      threadPool
    }),
    new HappyPack({
      id: 'sass',
      verbose: false,
      loaders: [
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&minimize=true!sass-loader'
      ],
      threadPool
    })
  ],

  target: 'electron-renderer'
});
