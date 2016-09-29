(function () {
  'use strict';

  angular
    .module('core')
    .controller('CreateTasksController', CreateTasksController);

  CreateTasksController.$inject = ['Tasks', 'Alert'];

  function CreateTasksController(Tasks, Alert) {
    const vm = this;
    vm.task = {
      title: '',
    };
    vm.create = create;

    function create() {
      Tasks.create(vm.task)
        .then(successCreate)
        .catch(failedCreate);

      function successCreate(task) {
        Alert.display('Success', 'Success');
        vm.task = task;
      }

      function failedCreate(err) {
        Alert.display('Error', err);
      }
    }
  }
}());
