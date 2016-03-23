(function () {
  'use strict';

  angular
      .module('users')
      .factory('Users', Users);

  Users.$inject = ['MEANRestangular'];

  function Users(MEANRestangular) {
    const service = {
      edit,
      me,
      validate,
    };
    return service;

    function edit(id, user) {
      return MEANRestangular.one('users/me').customPUT(user)
        .then(updateCompleted)
        .catch(updateFailed);

      function updateCompleted(response) {
        return response;
      }

      function updateFailed(err) {
        console.log('Edit user Failed', err);
        throw err.data;
      }
    }

    function me() {
      return MEANRestangular.one('users/me').get()
        .then(updateCompleted)
        .catch(updateFailed);

      function updateCompleted(response) {
        return response;
      }

      function updateFailed(err) {
        console.log('Get user Failed', err);
        throw err.data;
      }
    }

    function validate(id) {
      return MEANRestangular.one('users/validate', id).get()
        .then(validateCompleted)
        .catch(validateFailed);

      function validateCompleted(response) {
        return response;
      }

      function validateFailed(err) {
        console.log('Get user Failed', err);
        throw err.data;
      }
    }
  }
}());
