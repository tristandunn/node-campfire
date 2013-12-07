var Campfire = require("../lib/campfire").Campfire;

var instance = new Campfire({
  token   : "YOUR_TOKEN",
  account : "YOUR_ACCOUNT"
});

instance.join(ROOM_ID, function(error, room) {
  var listener = room.listen(function(message) {
    if (message.body == "PING") {
      console.log("PING received.");

      room.speak("PONG", function(error, response) {
        console.log("PONG sent at " + response.message.created_at + ".");
      });
    } else if (message.body == "END") {
      listener.end();
    } else {
      console.log("Received unknown message:");
      console.log(message);
    }
  });
});
