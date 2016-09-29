(function () {
  'use strict';

  angular
    .module('users')
    .controller('ValidateUserController', ValidateUserController);

  ValidateUserController.$inject = ['$state', '$timeout', 'Users', 'Alert', 'Authentication'];

  function ValidateUserController($state, $timeout, Users, Alert, Authentication) {
    const vm = this;
    vm.init = init;
    vm.messagge = 'Su email se está validando...';

    vm.init();

    function init() {
      Users.validate($state.params.token)
        .then(successValidate)
        .catch(failedValidate);

      function successValidate(user) {
        vm.messagge = 'Email validado. Redireccionando a la home...';
        $timeout(() => {
          $state.go('home');
        }, 5000);
      }

      function failedValidate(err) {
        Alert.display('Error', err);
      }
    }
  }
}());
