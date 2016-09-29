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
      facebookClientId: '374060836051419',
      googleClientId: '',
      instagramClientId: '9aa71af93aef40e6bf6af9bed03f88d7',
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
