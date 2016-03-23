(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$uibModal', '$state', 'Authentication', 'AuthenticationModal'];

  function HeaderController($uibModal, $state, Authentication, AuthenticationModal) {
    const vm = this;
    vm.openLogin = AuthenticationModal.openLogin;
    vm.logout = Authentication.logout;
    vm.authentication = Authentication;
  }
}());
