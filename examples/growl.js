var system   = require("sys");
var Campfire = require("../lib/campfire").Campfire;

var instance = new Campfire({
  ssl     : false,
  token   : "YOUR_TOKEN",
  account : "YOUR_ACCOUNT"
});

instance.join(ROOM_ID, function(error, room) {
  room.listen(function(message) {
    // Ignore emotes, sounds, timestamps, etc.
    if (message.type != "TextMessage") {
      return;
    }

    // Ignore your own messages.
    // if (message.user.name == "YOUR_NAME") {
    //   return;
    // }

    // Only notify on keywords.
    // var keywords = ["YOUR_NAME", "URGENT", "Whatever"];
    //
    // if (!message.body.match(new RegExp(keywords.join("|")))) {
    //   return;
    // }

    var
    command = "/usr/local/bin/growlnotify";
    command += " -t '" + message.user.name + "'";
    command += " -m '" + message.body.replace("'", "'") + "'";
    command += " --image 'examples/images/icon.png'";

    system.exec(command);
  });
});
