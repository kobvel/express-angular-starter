(function () {
  'use strict';

  angular
    .module('core')
    .provider('$configuration', $configuration);

  $configuration.$inject = [];

  /* @ngInject */
  function $configuration() {
    const data = {
      baseUrlApi: isLocalHost() ? 'https://localhost:3000/api/v1/' : 'https://localhost:3000/api/v1/',
      baseUrl: isLocalHost() ? 'https://localhost:3000' : 'https://localhost:3000',
      facebookClientId: '',
      googleClientId: '',
      instagramClientId: '',
      twitterClientId: '',
    };

    /**
     * Check if current location is localhost
     */
    function isLocalHost() {
      return window.location.hostname === 'localhost';
    }

    const provider = {
      $get: () => {
        return data;
      },
    };

    return provider;
  }
}());
