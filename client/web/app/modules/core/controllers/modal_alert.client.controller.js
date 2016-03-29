(function () {
  'use strict';

  angular
    .module('core')
    .controller('ModalAlertController', ModalAlertController);

  ModalAlertController.$inject = ['$uibModalInstance', 'title', 'content'];

  function ModalAlertController($uibModalInstance, title, content) {
    const vm = this;
    vm.close = closeModal;
    vm.title = title;
    vm.content = content;

    function closeModal() {
      $uibModalInstance.dismiss();
    }
  }
}());
