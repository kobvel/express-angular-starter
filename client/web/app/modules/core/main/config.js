'use strict';

// Init the application configuration module for AngularJS application
/* exported ApplicationConfiguration */
/* exported */
const ApplicationConfiguration = (function () {
  // Init module configuration options
  const applicationModuleName = 'meanweb';
  const applicationModuleVendorDependencies = [
    'ui.router', 'ui.utils', 'ui.bootstrap',
    'ngStorage', 'restangular', 'ngAnimate', 'angular-loading-bar',
  ];

  // Add a new vertical module
  const registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName,
    applicationModuleVendorDependencies,
    registerModule,
  };
}());

console.log(ApplicationConfiguration.applicationModuleName);
