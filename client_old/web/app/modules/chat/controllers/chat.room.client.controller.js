(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$socket', '$timeout', 'Authentication'];

  function ChatController($socket, $timeout, Authentication) {
    const vm = this;
    vm.init = init;
    vm.sendMessage = sendMessage;
    vm.messages = [];
    vm.down = down;

    vm.init();

    $socket.on('send:conversation', (messages) => {
      vm.messages = messages;
      $timeout(() => {
        vm.down();
      }, 50);
    });

    function init() {
      $socket.emit('create', 'room');
    }

    function sendMessage() {
      const message = vm.message.trim();
      if (message.length > 0) {
        const msg = {
          msg: message,
          created_at: new Date(),
          user_name: Authentication.user.name,
        };
        vm.message = '';
        $socket.emit('send:conversation', msg);
      }
    }

    function down() {
      const h = $('#realHeight')[0].scrollHeight;
      $('#chatDiv').animate({ scrollTop: h }, 0);
    }
  }
}());
