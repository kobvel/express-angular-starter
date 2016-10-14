(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('taskservice', taskservice);

  taskservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function taskservice($http, $q, exception, logger) {
    const service = {
      createTask,
      getTasks,
      getPaginated,
      getMessageCount,
    };

    return service;

    function getMessageCount() { return $q.when(72); }

    function getTasks() {
      return $http.get('/api/v1/tasks')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getTasks')(e);
      }
    }

    function getPaginated() {
      return $http.get('/api/v1/tasks/paginated')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPaginated')(e);
      }
    }

    function createTask(task) {
      return $http.post('/api/v1/tasks', task)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for createTask')(e);
      }
    }
  }
}());
