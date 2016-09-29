(function () {
  'use strict';

  angular
    .module('core')
    .factory('AuthInterceptor', AuthInterceptor);


  AuthInterceptor.$inject = ['$q', '$injector', '$rootScope'];

  function AuthInterceptor($q, $injector, $rootScope) {
    return {
      responseError: (rejection) => {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $rootScope.$broadcast('user-invalid-token');
              $injector.get('$state').transitionTo('home');
              break;
            case 403:
              $injector.get('$state').transitionTo('home');
              break;
            default:
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      },
    };
  }
}());
