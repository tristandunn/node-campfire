var system   = require('sys');
var Campfire = require('../lib/campfire').Campfire;

var instance = new Campfire({
  ssl     : false,
  token   : 'YOUR_TOKEN',
  account : 'YOUR_ACCOUNT'
});

instance.room(ROOM_ID_OR_NAME, function(room) {
  room.join(function() {
    room.listen(function(message) {
      if (message.body == 'PING') {
        system.puts('PING received.');

        room.speak('PONG', function(data) {
          system.puts('PONG sent at ' + data.message.created_at + '.');
        });
      } else {
        system.puts('Received unknown message:');
        system.puts(system.inspect(message));
      }
    });
  });
});
