(function () {
  'use strict';

  angular
      .module('core')
      .factory('Tasks', Tasks);

  Tasks.$inject = ['$http', '$configuration'];

  function Tasks($http, $configuration) {
    const apiUrl = $configuration.baseUrlApi;
    const service = {
      create,
      getAll,
    };
    return service;

    function create(task) {
      return $http.post(apiUrl + 'tasks', task);
    }

    /**
     * Get all tasks using $http call, replace by to use restangular
     * return MEANRestangular.all('tasks').getList();
     */
    function getAll(config) {
      return $http.get(apiUrl + 'tasks', config);
    }
  }
}());
