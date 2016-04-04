(function () {
  'use strict';

  angular
    .module('users')
    .controller('PasswordRecoveryController', PasswordRecoveryController);

  PasswordRecoveryController.$inject = [
    '$uibModalInstance',
    'Authentication', 'Alert', 'AuthenticationModal'];

  function PasswordRecoveryController($uibModalInstance,
    Authentication, Alert, AuthenticationModal) {
    const vm = this;

    // User credentials (email)
    vm.credentials = {
      email: undefined,
    };
    // Modal messages
    vm.messages = {
      error: undefined,
      email: undefined,
      success: undefined,
    };
    // Modal interaction
    vm.enabled = true;
    // Functions
    vm.doRecovery = doRecovery;
    vm.isValidData = isValidData;

    /**
     * Do password recovery
     */
    function doRecovery() {
      // Check data
      if (!isValidData() || !vm.enabled) {
        return;
      }

      // Disable interaction
      vm.enabled = false;
      // do password recovery
      Authentication.forgot(vm.credentials)
        .then(forgotCompleted)
        .catch(forgotFailed);

      // if login completed close modal, go to booking list
      function forgotCompleted(message) {
        if (message.errorMessage) {
          Alert.display('Error', message.errorMessage).result
            .then(AuthenticationModal.openLogin)
            .catch(AuthenticationModal.openLogin);

          vm.enabled = true;
          // Clear success message
          vm.messages.success = null;
          // Write error message
          vm.messages.error = message.errorMessage;
        } else {
          // Clear error message
          vm.messages.error = null;
          // Write success message
          vm.messages.success = 'Please check your email';
          // Close recovery modal (this)
          $uibModalInstance.dismiss();
          // Open alert modal with success text, and after close go to login
          Alert.display('Success', 'Please check your email').result
            .then(AuthenticationModal.openLogin)
            .catch(AuthenticationModal.openLogin);
        }
      }

      // show error if login failed
      function forgotFailed(err) {
        // Re enable interaction
        vm.enabled = true;
        // Clear success message
        vm.messages.success = null;
        // Write error message
        vm.messages.error = err.message;
      }
    }

    /*
     * Check if the form has valid data
     */
    function isValidData(field) {
      // validation result
      let res = true;

      // Email validation
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      // Clear global error message
      vm.messages.error = null;

      // Validate Email
      if ((field && field === 'email') || !field) {
        if (regex.exec(vm.credentials.email) !== null) {
          res &= true;
          vm.messages.email = null;
        } else {
          res &= false;
          vm.messages.email = 'Please insert a valid email address';
        }
      }

      return res;
    }
  }
}());
