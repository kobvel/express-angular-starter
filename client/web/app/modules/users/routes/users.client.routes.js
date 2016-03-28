(function () {
  'use strict';

  // Setting up route
  angular
    .module('users')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider', '$authProvider'];

  function Routes($stateProvider, $urlRouterProvider, $authProvider) {
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

    /*
     * Configuration of social network login - satellizer
     */
    $authProvider.authToken = 'JWT';

    $authProvider.facebook({
      clientId: '',
      url: 'https://localhost:3000/api/v1/auth/facebook',
    });

    $authProvider.twitter({
      url: 'https://localhost:3000/api/v1/auth/twitter',
      responseType: 'token',
    });

    $authProvider.google({
      clientId: '',
      url: 'https://localhost:3000/api/v1/auth/google',
    });

    $authProvider.github({
      clientId: 'GitHub Client ID',
    });

    $authProvider.linkedin({
      clientId: 'LinkedIn Client ID',
    });

    $authProvider.instagram({
      clientId: '',
      url: 'https://localhost:3000/api/v1/auth/instagram',
    });

    $authProvider.yahoo({
      clientId: 'Yahoo Client ID / Consumer Key',
    });

    $authProvider.live({
      clientId: 'Microsoft Client ID',
    });

    $authProvider.twitch({
      clientId: 'Twitch Client ID',
    });

    $authProvider.bitbucket({
      clientId: 'Bitbucket Client ID',
    });

    // No additional setup required for Twitter

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'Foursquare Client ID',
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
    });
  }
}());
