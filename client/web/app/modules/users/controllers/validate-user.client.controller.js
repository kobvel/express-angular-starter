(function () {
  'use strict';

  angular
    .module('users')
    .controller('ValidateUserController', ValidateUserController);

  ValidateUserController.$inject = ['$state', '$timeout', 'Users', 'Alert', 'Authentication'];

  function ValidateUserController($state, $timeout,Users, Alert, Authentication) {
    var vm = this;
    vm.init = init;
    vm.messagge = 'Su email se está validando...';

    vm.init();

    function init() {
      Users.validate($state.params.id)
        .then(successValidate)
        .catch(failedValidate);

      function successMe(user) {
        vm.messagge = 'Email validado. Redireccionando a la home...';
        $timeout(function(){
          $state.go('home');
        }, 5000);
      }

      function failedMe(err) {
        Alert.display('Error', err);
      }
    }
  }
}());
