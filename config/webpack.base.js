const path = require('path');
const webpack = require('webpack');
const projectRoot = path.join(__dirname, '../');
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const postCssConfig = require(`${projectRoot}/config/postcss.config.${devMode ? 'dev' : 'prod'}.js`);
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  webpack,
  path,
  projectRoot,
  baseSettings: {
    entry: [
      projectRoot + '/public/public/scss/style.scss',
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            miniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              ident: 'postcss',
              options: {
                sourceMap: postCssConfig.sourceMap,
                plugins: postCssConfig.plugins
              }
            }
          ]
        }
      ]
    },
    output: {
      path: projectRoot + '/public/public/dist',
    },
    plugins: [
      new cleanWebpackPlugin([projectRoot + '/public/public/dist'], {
        root: projectRoot + '/public/public',
        verbose: true,
        dry: false,
        watch: true,
      }),
      new miniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
      })
    ],
  }
}; 
