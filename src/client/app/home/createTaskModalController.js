(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('createTaskModalController', createTaskModalController);

  createTaskModalController.$inject = ['$uibModalInstance', 'taskservice', 'logger'];
  /* @ngInject */
  function createTaskModalController($uibModalInstance, taskservice, logger) {
    const vm = this;
    vm.find = find;
    vm.cancel = cancel;
    vm.task = {};
    activate();

    function activate() {}

    function createTask() {
      return taskservice.createTask(vm.task).then(data => {
        $uibModalInstance.close();
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
}());
