(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$uibModal', 'logger', 'authentication', 'taskservice'];
  /* @ngInject */
  function HomeController($uibModal, logger, authentication, taskservice) {
    const vm = this;
    vm.user = authentication.user;
    vm.title = 'Home';
    vm.tasks = [];
    vm.showModal = showModal;

    activate();

    function activate() {
      taskservice.getTasks()
        .then((tasks) => {
          vm.tasks = tasks;
        });
    }

    function showModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/home/createTaskModal.html',
        controller: 'createTaskModalController',
        controllerAs: 'ctmc',
        resolve: {
          taskservice: () => {
            return taskservice;
          },
          logger: () => {
            return logger;
          },
        },
      });

      modalInstance.result
        .then(success);

      function success() {
        logger.success('Task created');
      }
    }
  }
}());
