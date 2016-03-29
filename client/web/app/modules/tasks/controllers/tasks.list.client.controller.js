(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('ListTasksController', ListTasksController);

  ListTasksController.$inject = ['$rootScope', 'Tasks', 'Alert', 'Authentication'];

  function ListTasksController($rootScope, Tasks, Alert, Authentication) {
    const vm = this;

    activate();

    $rootScope.$on('user-login', activate);
    $rootScope.$on('user-logout', cleanTasks);

    // //////////////

    function activate() {
      if (Authentication.user) {
        Tasks.getAll()
          .then(successResponse)
          .catch(failedResponse);
      }

      function successResponse(tasks) {
        vm.tasks = tasks;
      }

      function failedResponse(err) {
        Alert.display(err);
      }
    }

    function cleanTasks() {
      vm.tasks = [];
    }
  }
}());
