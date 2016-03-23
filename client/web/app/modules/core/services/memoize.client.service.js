(function () {
  'use strict';

  angular
    .module('core')
    .factory('memoize', memoize);

  memoize.$inject = [];

  function memoize() {
    return service;

    // //////////////
    function service(...args) {
      return memoizeFactory.apply(this, args);
    }

    function memoizeFactory(fn) {
      const cache = {};

      function memoized(...args) {
        /**
         * Original code args tratament
         * let args = [].slice.call(arguments);
         */

        const key = JSON.stringify(args);
        const fromCache = cache[key];
        if (fromCache) {
          return fromCache;
        }
        cache[key] = fn.apply(this, args);

        return cache[key];
      }

      return memoized;
    }
  }
}());
