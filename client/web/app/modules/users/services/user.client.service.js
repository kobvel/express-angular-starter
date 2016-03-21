(function () {
  'use strict';

  angular
      .module('users')
      .factory('Users', Users);

  Users.$inject = ['MEANRestangular'];

  function Users(MEANRestangular) {
    var service = {
      edit: edit,
      me: me,
    };
    return service;

    function edit(user) {
      return MEANRestangular.one('users', user.id).customPUT(user)
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
  }
}());
