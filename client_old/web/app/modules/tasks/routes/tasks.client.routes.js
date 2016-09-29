(function () {
  'use strict';

  // Setting up route
  angular
    .module('tasks')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider) {
    const prefix = '../modules/tasks/templates/';

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('tasks', {
      url: '/tasks',
      abstract: true,
      templateUrl: prefix + 'tasks.client.template.html',
    })
    .state('tasks.list', {
      url: '/list',
      abstract: false,
      templateUrl: prefix + 'tasks.list.client.template.html',
      controller: 'ListTasksController as ltc',
    })
    .state('tasks.create', {
      url: '/create',
      abstract: false,
      templateUrl: prefix + 'tasks.create.client.template.html',
      controller: 'CreateTasksController as ctc',
    });
  }
}());
