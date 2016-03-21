(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditUserController', EditUserController);

  EditUserController.$inject = ['Users', 'Alert', 'Authentication'];

  function EditUserController(Users, Alert, Authentication) {
    var vm = this;
    vm.user = {};
    vm.user.name = Authentication.user.name;
    vm.user.id = Authentication.user.id;

    console.log(vm.user);
    vm.edit = edit;

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
