(function () {
  'use strict';

  // Authentication service for user variables
  angular
    .module('users')
    .factory('AuthenticationModal', AuthenticationModal);

  AuthenticationModal.$inject = ['$uibModal'];

  function AuthenticationModal($uibModal) {
    const authM = {
      openLogin,
      openSignup,
      openRecovery,
    };

    return authM;

    // implementations //

    /**
     * Open login modal
     */
    function openLogin() {
      const modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/users/templates/login.modal.template.html',
        windowClass: 'hs-modal',
        controller: 'LoginController as mlc',
      });
      return modalInstance;
    }

    /**
     * Open signup modal
     */
    function openSignup() {
      const modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/users/templates/signup.modal.template.html',
        windowClass: 'hs-modal',
        controller: 'SignupController as sc',
      });
      return modalInstance;
    }

    /**
     * Open recovery modal
     */
    function openRecovery() {
      const modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/users/templates/recovery.modal.template.html',
        windowClass: 'hs-modal',
        controller: 'PasswordRecoveryController as mprc',
      });
      return modalInstance;
    }
  }
}());
