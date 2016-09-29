(function () {
  'use strict';

  angular
    .module('core')
    .factory('$socket', SocketIO);

  SocketIO.$inject = ['$rootScope', '$configuration'];

  function SocketIO($rootScope, $configuration) {
    const socket = io($configuration.baseUrl);
    return {
      on: (eventName, callback) => {
        socket.on(eventName, (...args) => {
          $rootScope.$apply(() => {
            callback.apply(socket, args);
          });
        });
      },
      emit: (eventName, data, callback) => {
        socket.emit(eventName, data, (...args) => {
          $rootScope.$apply(() => {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
    };
  }
}());
