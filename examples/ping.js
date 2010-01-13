var system   = require('sys');
var Campfire = require('../lib/campfire').Campfire;

Campfire.initialize({
  token   : 'YOUR_TOKEN',
  account : 'YOUR_ACCOUNT',
  room_id : 'YOUR_DEFAULT_ROOM_ID'
});

Campfire.join(function() {
  Campfire.listen(function(message) {
    if (message.body == 'PING') {
      system.puts('PING received.');

      Campfire.say('PONG', function(data) {
        system.puts('PONG sent at ' + data.message.created_at + '.');
      });
    } else {
      system.puts('Received unknown message:');
      system.puts(system.inspect(message));
    }
  });
});
