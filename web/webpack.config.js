'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlPlugin = require('webpack-html-plugin');
var HasteResolverPlugin = require('haste-resolver-webpack-plugin');

var IP = '0.0.0.0';
var PORT = 3000;
var NODE_ENV = process.env.NODE_ENV;
var ROOT_PATH = path.resolve(__dirname, '..');
var PROD = 'production';
var DEV = 'development';
let isProd = NODE_ENV === 'production';
let isWatch = process.env.WEBPACK_WATCH === 'true';

var config = {
  paths: {
    src: path.join(ROOT_PATH, '.'),
    index: path.join(ROOT_PATH, 'index.web'),
  },
};

var webpackConfig = {
  ip: IP,
  port: PORT,
  devtool: isProd ? false : 'cheap-module-eval-source-map',
  resolve: {
    alias: {
      'react-native': 'ReactWeb',
    },
    extensions: ['', '.js', '.web.js', '.ios.js', '.android.js', '.native.js', '.jsx'],
  },
  entry: isProd || isWatch ? [
    'babel-polyfill',
    config.paths.index
  ] : [
    'babel-polyfill',
    'webpack-dev-server/client?http://' + IP + ':' + PORT,
    'webpack/hot/only-dev-server',
    config.paths.index,
  ],
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'bundle.js',
    publicPath:''
  },
  plugins: [
    new HasteResolverPlugin({
      platform: 'web',
      nodeModules: ['react-web']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(isProd ? PROD : DEV),
      },
      __WEBPACK_WATCH__: isWatch,
      '__DEV__': !isProd
    }),
    isProd || isWatch ? new webpack.ProvidePlugin({
      React: 'react'
    }) : new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlPlugin({
      template: path.join(__dirname, 'index.html')
    }),
  ],
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.html?$/,
      loader: 'file-loader'
    }, {
      test: /\.jsx?$/,
      loader: 'react-hot/webpack',
      include: [config.paths.src],
      exclude: [/node_modules/]
    }, {
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        presets: ['react-native', 'stage-1']
      },
      include: [
        config.paths.index,
        path.join(ROOT_PATH, 'node_modules/react-web'),
        path.join(ROOT_PATH, 'app'),
        path.join(ROOT_PATH, 'lib'),
        path.join(ROOT_PATH, 'node_modules/react-clone-referenced-element'),
        path.join(ROOT_PATH, 'node_modules/react-native-camera'),
        path.join(ROOT_PATH, 'node_modules/react-native-check-box'),
        path.join(ROOT_PATH, 'node_modules/react-native-image-crop-picker'),
        path.join(ROOT_PATH, 'node_modules/react-native-permissions'),
        path.join(ROOT_PATH, 'node_modules/react-native-scrollable-tab-view'),
        path.join(ROOT_PATH, 'node_modules/react-native-smart-barcode'),
        path.join(ROOT_PATH, 'node_modules/react-native-tab-view'),
        path.join(ROOT_PATH, 'node_modules/react-navigation'),
      ],
      exclude: [
        path.join(ROOT_PATH, 'node_modules/react-web/node_modules/immutable/dist/immutable.js'),
      ]
    }, {
      test : /\.(png|eot|gif|svg|jpg)$/,
      loader : 'url-loader?limit=8192'
    }]
  }
};
webpackConfig.resolve.alias[path.basename(ROOT_PATH, '.')] = path.join(ROOT_PATH, '.');

module.exports = webpackConfig;
