(function () {
  'use strict';

  // Setting up route
  angular
    .module('core')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider) {
    const prefix = '../modules/core/templates/';

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
      url: '/',
      abstract: false,
      templateUrl: prefix + 'home.client.template.html',
      controller: 'HomeController as hc',
    });
  }
}());
