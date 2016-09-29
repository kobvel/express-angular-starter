(function () {
  'use strict';

  angular
    .module('users')
    .config(Satellizer);

  Satellizer.$inject = ['$authProvider', '$configurationProvider'];

  function Satellizer($authProvider, $configurationProvider) {
    const values = $configurationProvider.$get();

    /*
     * Configuration of social network login - satellizer
     */
    $authProvider.authToken = 'JWT';

    // Facebook
    $authProvider.facebook({
      clientId: values.facebookClientId,
      url: values.baseUrlApi + 'auth/facebook',
    });

    // Twitter
    $authProvider.twitter({
      url: values.baseUrlApi + 'auth/twitter',
      clientId: values.twitterClientId,
    });

    // Google
    $authProvider.google({
      clientId: values.googleClientId,
      url: values.baseUrlApi + 'auth/google',
    });

    // Instagram
    $authProvider.instagram({
      clientId: values.instagramClientId,
      url: values.baseUrlApi + 'auth/instagram',
    });

    // Pinterest
    $authProvider.oauth2({
      name: 'pinterest',
      url: values.baseUrlApi + 'auth/pinterest',
      clientId: '&scope=read_public',
      redirectUri: window.location.origin,
      response_type: 'token',
      scope: 'read_public',
      authorizationEndpoint: 'https://api.pinterest.com/oauth/',
    });
  }
}());
