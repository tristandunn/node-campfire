var Campfire = require("../lib/campfire").Campfire;

var instance = new Campfire({
  ssl     : false,
  token   : "YOUR_TOKEN",
  account : "YOUR_ACCOUNT"
});

instance.join(ROOM_ID, function(error, room) {
  room.listen(function(message) {
    if (message.body == "PING") {
      console.log("PING received.");

      room.speak("PONG", function(error, response) {
        console.log("PONG sent at " + response.message.created_at + ".");
      });
    } else {
      console.log("Received unknown message:");
      console.log(message);
    }
  });
});
