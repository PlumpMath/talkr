(function() {
  'use strict';

  var player = new VersalPlayerAPI();
  var el = document.querySelector('#app');
  var form = document.querySelector('.peer-connect-form');
  var peer;
  var isConnected = false;
  var conn;
  var messages = document.querySelector('.messages');

  function displayPeerId(id) {
    var idSpan = document.createElement('span');

    idSpan.textContent = 'Peer id is ' + id;
    el.appendChild(idSpan);
  }

  function listenForSubmit() {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var input = document.querySelector('input[type="text"]');

      if (!isConnected) {
        var id = input.value;
        conn = peer.connect(id);
        console.log('connection attempted');
        isConnected = true;

        input.value = '';

        setupMessager();
      } else if (conn) {
        var msg = input.value;
        conn.send(msg);
        messages.innerHTML += '<span class="msg">> ' + msg + '</span>';

        input.value = '';
        messages.scrollTop += 100;
      }
    });
  }

  function setupMessager() {
    if (conn) {
      conn.on('data', function(data) {
        messages.innerHTML += '<span class="msg own">' + data + '</span>';
        messages.scrollTop += 100;
      });
    } else {
      setTimeout(function() { setupMessager() }, 500);
    }
  }

  function setupPeer() {
    peer = new Peer({ key: '09yuyscezkkpgb9' });

    peer.on('connection', function(connection) {
      connection.on('open', function() {
        console.log('client connected');

        isConnected = true;
        conn = connection;
        setupMessager();
      });
    });

    // on connection
    peer.on('open', function(id) {
      displayPeerId(id);
      listenForSubmit();
    });
  }

  function init() {
    player.startListening();
    player.setHeight(500);
    setupPeer();
  }

  window.onload = function() {
    init();
  };
}());
