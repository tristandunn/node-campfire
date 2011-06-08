var Campfire = require('../lib/campfire').Campfire;

var instance = new Campfire({
  ssl     : false,
  token   : 'YOUR_TOKEN',
  account : 'YOUR_ACCOUNT'
});

instance.room(ROOM_ID, function(room) {
  room.join(function() {
    room.listen(function(message) {
      if (message.body == 'PING') {
        console.log('PING received.');

        room.speak('PONG', function(data) {
          console.log('PONG sent at ' + data.message.created_at + '.');
        });
      } else {
        console.log('Received unknown message:');
        console.log(message);
      }
    });
  });
});
