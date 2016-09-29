(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditUserController', EditUserController);

  EditUserController.$inject = ['Users', 'Alert', 'Authentication'];

  function EditUserController(Users, Alert, Authentication) {
    const vm = this;
    vm.user = {};

    vm.edit = edit;
    vm.init = init;

    vm.init();

    function init() {
      Users.me()
        .then(successMe)
        .catch(failedMe);

      function successMe(user) {
        vm.user.name = user.name;
        vm.user.email = user.email;
      }

      function failedMe(err) {
        Alert.display('Error', err);
      }
    }

    function edit() {
      Users.edit(Authentication.user.id, vm.user)
        .then(successEdit)
        .catch(failedEdit);

      function successEdit(user) {
        Alert.display('Success', 'Edit Success');
        Authentication.user = vm.user;
      }

      function failedEdit(err) {
        Alert.display('Error', err.msg);
      }
    }
  }
}());
