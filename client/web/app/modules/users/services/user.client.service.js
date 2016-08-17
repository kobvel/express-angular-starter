(function () {
  'use strict';

  angular
      .module('users')
      .factory('Users', Users);

  Users.$inject = ['$http', '$configuration'];

  function Users($http, $configuration) {
    const apiUrl = $configuration.baseUrlApi;
    const service = {
      edit,
      me,
      validate,
    };
    return service;

    function edit(id, user) {
      return $http.put(apiUrl + 'users/me', user)
        .then(updateCompleted)
        .catch(updateFailed);

      function updateCompleted(response) {
        return response.data;
      }

      function updateFailed(err) {
        console.log('Edit user Failed', err);
        throw err.data;
      }
    }

    function me() {
      return $http.get(apiUrl + 'users/me')
        .then(updateCompleted)
        .catch(updateFailed);

      function updateCompleted(response) {
        return response.data;
      }

      function updateFailed(err) {
        console.log('Get user Failed', err);
        throw err.data;
      }
    }

    function validate(id) {
      return $http.get(apiUrl + 'users/validate')
        .then(validateCompleted)
        .catch(validateFailed);

      function validateCompleted(response) {
        return response.data;
      }

      function validateFailed(err) {
        console.log('Get user Failed', err);
        throw err.data;
      }
    }
  }
}());
