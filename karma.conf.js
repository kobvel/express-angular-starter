// Karma configuration
// Generated on Wed Mar 25 2015 15:10:29 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [

      'client/web/bower_components/angular/angular.js',
      'client/web/bower_components/angular-mocks/angular-mocks.js',

      'client/web/bower_components/restangular/dist/restangular.js',
      'client/web/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/web/bower_components/angular-ui-utils/ui-utils.js',
      'client/web/bower_components/angular-bootstrap/ui-bootstrap.js',
      'client/web/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/web/bower_components/ngstorage/ngStorage.js',
      'client/web/bower_components/angular-animate/angular-animate.js',
      'client/web/bower_components/angular-loading-bar/build/loading-bar.js',



      'client/web/app/modules/core/main/config.js',
      'client/web/app/modules/core/main/init.js',
      'client/web/app/modules/core/main/angular-config.js',
      'client/web/app/modules/core/main/angular-run.js',
      'client/web/app/modules/core/core.client.module.js',

      'client/web/app/modules/*/*.js',
      'client/web/app/modules/**/*.js',
      'client/web/app/modules/**/tests/unit/*.js'
    ],


    // list of files to exclude
    exclude: [
      'client/web/app/modules/**/tests/e2e/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'client/web/app/modules/**/test/unit/*.js': ['babel']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    plugins: ['karma-phantomjs-launcher', 'karma-jasmine', 'karma-babel-preprocessor'],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
