'use strict';

// Protractor configuration
var config = {
  specs: ['client/web/app/modules/*/tests/e2e/*.e2e.test.js'],
  allScriptsTimeout: 20000,
  params: {
    baseUrl: 'https://localhost:9000'
  }
};

if (process.env.JENKINS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
