(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeadController', HeadController);

  HeadController.$inject = ['Seo'];

  function HeadController(Seo) {
    const vm = this;
    vm.Seo = Seo;
  }
}());
