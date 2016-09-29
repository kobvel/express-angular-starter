(function () {
  'use strict';

  angular
    .module('core')
    .controller('ModalConfirmController', ModalConfirmController);

  ModalConfirmController.$inject = ['$uibModalInstance', 'title', 'content', 'callback'];

  function ModalConfirmController($uibModalInstance, title, content, callback) {
    const vm = this;
    vm.close = closeModal;
    vm.title = title;
    vm.content = content;
    vm.accept = acceptQuestion;

    function closeModal() {
      $uibModalInstance.dismiss();
    }

    function acceptQuestion() {
      $uibModalInstance.dismiss();
      callback();
    }
  }
}());
