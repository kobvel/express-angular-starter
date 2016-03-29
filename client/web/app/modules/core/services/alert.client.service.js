(function () {
  'use strict';

  angular
    .module('core')
    .factory('Alert', Alert);

  Alert.$inject = ['$uibModal'];

  function Alert($uibModal) {
    const service = {
      display,
      confirm,
    };
    return service;

    function display(title, content) {
      const modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/core/templates/modal_alert.client.template.html',
        windowClass: 'hs-modal',
        controller: 'ModalAlertController as mac',
        resolve: {
          title: () => {
            return title;
          },
          content: () => {
            return content;
          },
        },
      });

      return modalInstance;
    }

    function confirm(title, content, callback) {
      const modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/core/templates/modal_confirm.client.template.html',
        windowClass: 'hs-modal',
        controller: 'ModalConfirmController as mcc',
        resolve: {
          title: () => {
            return title;
          },
          content: () => {
            return content;
          },
          callback: () => {
            return callback;
          },
        },
      });

      return modalInstance;
    }
  }
}());
