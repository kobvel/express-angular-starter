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

    activate();

    function activate() {}

    function showModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/home/createTaskModal.html',
        controller: 'createTagModalController',
        controllerAs: 'tnmc',
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
