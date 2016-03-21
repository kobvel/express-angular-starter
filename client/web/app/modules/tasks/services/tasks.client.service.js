(function () {
  'use strict';

  angular
      .module('core')
      .factory('Tasks', Tasks);

  Tasks.$inject = ['$http', 'MEANRestangular'];

  function Tasks($http, MEANRestangular) {
    var service = {
      create: create,
      getAll: getAll,
    };
    return service;

    function create(task) {
      return MEANRestangular.all('tasks').post(task);
    }

    /**
     * Get all tasks using $http call, replace by to use restangular
     * return MEANRestangular.all('tasks').getList();
     */
    function getAll(config) {
      return $http.get('https://localhost:3000/api/v1/tasks/', config);
    }
  }
}());
