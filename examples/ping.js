var system   = require('sys');
var Campfire = require('../lib/campfire').Campfire;

Campfire.initialize({
  token   : 'YOUR_TOKEN',
  account : 'YOUR_ACCOUNT'
});

var
room = Campfire.Room(ROOM_ID);
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
