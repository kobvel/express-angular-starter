(function () {
  'use strict';

  // Setting up route
  angular
    .module('users')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider) {
    const prefix = '../modules/users/templates/';

    $stateProvider

    .state('password-reset', {
      url: '/user/recovery/:token',
      abstract: false,
      templateUrl: prefix + 'password-reset.template.html',
      controller: 'PasswordResetController as prc',
    })
    .state('user-edit', {
      url: '/user/edit',
      abstract: false,
      templateUrl: prefix + 'user-edit.template.html',
      controller: 'EditUserController as uec',
    })
    .state('user-validate', {
      url: '/user/validate/:token',
      abstract: false,
      templateUrl: prefix + 'user-validate.template.html',
      controller: 'ValidateUserController as vuc',
    });
  }
}());
