(function () {
  'use strict';

  angular
    .module('core')
    .filter('sanitize', Sanitize);

  Sanitize.$inject = ['$sce'];

  function Sanitize($sce) {
    return SanitizeFilter;

    function SanitizeFilter(htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    }
  }
}());
