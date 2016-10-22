/* eslint import/no-dynamic-require: 0 */
const env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';
const config = require('./env/' + env + '.js');

module.exports = config;
