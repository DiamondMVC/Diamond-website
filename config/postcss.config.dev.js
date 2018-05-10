const postcssImport = require('postcss-import');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssExtend = require('postcss-extend');
const postcssNested = require('postcss-nested');
const postcssMixins = require('postcss-mixins');
const cssNano = require('cssnano');
const postcssNext = require('postcss-cssnext');
const postcssColorFunction = require('postcss-color-function');
const autoprefixer = require('autoprefixer');

module.exports = {
  sourceMap: 'inline',
  plugins: [
    postcssImport,
    postcssSimpleVars,
    postcssExtend,
    postcssNested,
    postcssMixins,
    cssNano,
    postcssNext,
    postcssColorFunction,
    autoprefixer({
      browsers: 'last 2 versions'
    })
  ]
};
