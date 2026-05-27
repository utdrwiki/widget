'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const { promisify } = require('util');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

async function build() {
  const compiler = webpack(webpackConfig);
  const stats = await promisify(compiler.run.bind(compiler))();
  const messages = formatWebpackMessages(stats.toJson({}, true));
  if (messages.errors.length > 0) {
    throw new Error(messages.errors.join('\n\n'));
  }
  if (messages.warnings.length) {
    throw new Error(messages.warnings.join('\n\n'));
  }
}

build();
