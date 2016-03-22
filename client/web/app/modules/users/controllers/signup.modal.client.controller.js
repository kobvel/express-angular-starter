(function () {
  'use strict';

  angular
    .module('users')
    .controller('SignupController', SignupController);

  SignupController
  .$inject = ['$timeout',
              '$state',
              '$uibModalInstance',
              'AuthenticationModal',
              'Authentication',
              'Alert'];

  function SignupController($timeout,
                            $state,
                            $uibModalInstance,
                            AuthenticationModal,
                            Authentication,
                            Alert) {
    var vm = this;
    // signup button status
    vm.enabled = true;
    // User credentials
    vm.credentials = {
      name: undefined,
      email: undefined,
      password: undefined,
      error: undefined,
      success: undefined,
    };
    // error messages
    vm.messages = {
      location: '',
      email: '',
      address: '',
      name: '',
      date: '',
    };
    // functions
    vm.signup = signup;
    vm.isValidData = isValidData;


    // Avoid register page when user already login
    if (Authentication.user) {
      $state.go('home');
    }

    // do signup
    function signup() {
      if (!isValidData() || !vm.enabled) {
        return;
      }

      // disable signup
      vm.enabled = false;

      Authentication.signup(vm.credentials)
        .then(signupCompleted)
        .catch(signupFailed);

      function signupCompleted(userParam) {
        // Success message
        vm.messages.success = 'Account created. Please check your email and validate.';
      }

      // When signup fail alert errros
      function signupFailed(err) {
        vm.error = err.data;
        vm.messages.error = vm.error.message;
        // enable signup
        vm.enabled = true;
      }
    }

    /*
     * Check if the form has valid data
     */
    function isValidData(field) {
      // validation result
      var res = true;
      // Email validation
      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


      // Clear global error message
      vm.messages.error = null;

      // Validate Name
      if ((field && field === 'name') || !field) {
        if ((typeof vm.credentials.name !== 'undefined') && (vm.credentials.name.trim() !== '')) {
          res &= true;
          vm.messages.name = null;
        } else {
          res &= false;
          vm.messages.name = 'Please insert your name';
        }
      }

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

      // Validate Password
      if ((field && field === 'password') || !field) {
        if ((typeof vm.credentials.password !== 'undefined') &&
            (vm.credentials.password.trim() !== '')) {
          res &= true;
          vm.messages.password = null;
        } else {
          res &= false;
          vm.messages.password = 'Please insert your account password';
        }
      }

      return res;
    }
  }
}());
