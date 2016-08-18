(function () {
  'use strict';

  // Setting up route
  angular
    .module('chat')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider) {
    const prefix = '../modules/chat/templates/';

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('chat', {
      url: '/chat',
      abstract: true,
      templateUrl: prefix + 'chat.client.template.html',
    })
    .state('chat.room', {
      url: '/chatroom',
      abstract: false,
      templateUrl: prefix + 'chat.room.client.template.html',
      controller: 'ChatController as cc',
    });
  }
}());
