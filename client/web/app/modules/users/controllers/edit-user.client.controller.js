(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditUserController', EditUserController);

  EditUserController.$inject = ['Users', 'Alert', 'Authentication'];

  function EditUserController(Users, Alert, Authentication) {
    var vm = this;
    vm.user = {};

    console.log(vm.user);
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
        vm.user.id = user.id;
      }

      function failedMe(err) {
        Alert.display('Error', err);
      }
    }

    function edit() {
      Users.edit(vm.user)
        .then(successCreate)
        .catch(failedCreate);

      function successCreate(user) {
        Alert.display('Success', 'Success');
        Authentication.user = vm.user;
      }

      function failedCreate(err) {
        Alert.display('Error', err);
      }
    }
  }
}());
