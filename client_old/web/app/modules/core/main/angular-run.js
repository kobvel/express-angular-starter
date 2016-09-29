(function (ApplicationConfiguration) {
  'use strict';

  angular
    .module(ApplicationConfiguration.applicationModuleName)
    .run(AngularRun);

  AngularRun.$inject = ['$rootScope', '$state', 'Authentication'];

  function AngularRun($rootScope, $state, Authentication) {
    // Check authentication before changing state
    $rootScope.$on('$stateChangeStart', checkPermissions);

    function checkPermissions(event, toState, toParams, fromState, fromParams) {
      let allowed = false;
      let index = 0;

      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        while (!allowed && index < toState.data.roles.length) {
          if ((toState.data.roles[index] === 'guest') ||
            (Authentication.user && Authentication.user.roles !== undefined &&
              Authentication.user.roles.indexOf(toState.data.roles[index]) !== -1)) {
            allowed = true;
          }
          index++;
        }

        if (!allowed) {
          event.preventDefault();
          if (Authentication.user !== undefined &&
            typeof Authentication.user === 'object') {
            $state.go('home');// forbiden
          } else {
            $state.go('home');
          }
        }
      }
    }
  }
}(ApplicationConfiguration));
