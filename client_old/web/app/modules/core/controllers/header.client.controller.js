(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$uibModal', '$state', 'Authentication',
  'AuthenticationModal'];

  function HeaderController($scope, $uibModal, $state, Authentication,
  AuthenticationModal) {
    const vm = this;
    vm.openLogin = AuthenticationModal.openLogin;
    vm.logout = Authentication.logout;
    vm.authentication = Authentication;
    vm.user = Authentication.user;

    $scope.$on('user-login', (user) => {
      vm.user = Authentication.user;
    });
    $scope.$on('user-logout', () => {
      vm.user = null;
    });
  }
}());
