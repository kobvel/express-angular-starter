(function () {
  'use strict';

  angular
      .module('users')
      .factory('Users', Users);

  Users.$inject = ['MEANRestangular'];

  function Users(MEANRestangular) {
    var service = {
      edit: edit
    };
    return service;

    function edit(user) {
      console.log('edit ',user);
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

  }
}());
