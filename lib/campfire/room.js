var Message = require("./message").Message;

var Room = function(campfire, data) {
  this.id              = data.id;
  this.name            = data.name;
  this.full            = data.full;
  this.topic           = data.topic;
  this.users           = data.users;
  this.locked          = data.locked;
  this.createdAt       = new Date(data.created_at);
  this.updatedAt       = new Date(data.updated_at);
  this.openToGuests    = data.open_to_guests;
  this.membershipLimit = data.membership_limit;

  this.path     = "/room/" + this.id;
  this.campfire = campfire;
};

Room.prototype.join = function(callback) {
  this.post("/join", "", callback);
};

Room.prototype.leave = function(callback) {
  this.post("/leave", "", callback);
};

Room.prototype.listen = function(callback) {
  if (!(callback instanceof Function)) {
    throw new Error("A callback must be provided for listening.");
  }

  var request,
      campfire  = this.campfire,
      listening = true,
      options   = {
        host    : campfire.streaming_host,
        port    : campfire.streaming_port,
        agent   : false,
        method  : "GET",
        path    : this.path + "/live.json",
        headers : {
          "Host"          : "streaming.campfirenow.com",
          "Authorization" : campfire.authorization
        }
      };

  (function listen() {
    request = campfire.http.request(options, function(response) {
      response.setEncoding("utf8");
      response.on("end", function() {
        if (listening) {
          listen();
        }
      });
      response.on("data", function(data) {
        data.split("\r").forEach(function(chunk) {
          try {
            var data = JSON.parse(chunk.trim());
          } catch(e) {
            return;
          }

          callback(new Message(campfire, data));
        });
      });
    });
    request.end();
  })();

  return {
    end: function() {
      listening = false;

      request.abort();
    }
  };
};

Room.prototype.lock = function(callback) {
  this.post("/lock", "", callback);
};

Room.prototype.message = function(text, type, callback) {
  this.post("/speak", { message : { body : text, type : type } }, callback);
};

Room.prototype.paste = function(text, callback) {
  this.message(text, "PasteMessage", callback);
};

Room.prototype.messages = function(callback) {
  this.get("/recent", function(error, response) {
    if (error) {
      return callback(error);
    } else if (response) {
      var messages = response.messages.map(function(message) {
        return new Message(this.campfire, message);
      }, this);
    }

    callback(null, messages);
  }.bind(this));
};

Room.prototype.show = function(callback) {
  this.post("", "", callback);
};

Room.prototype.sound = function(text, callback) {
  this.message(text, "SoundMessage", callback);
};

Room.prototype.speak = function(text, callback) {
  this.message(text, "TextMessage", callback);
};

Room.prototype.transcript = function(date, callback) {
  var path     = "/transcript",
      callback = callback || date;

  if (date instanceof Date) {
    path += "/" + date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
  }

  this.get(path, function(error, response) {
    if (error) {
      return callback(error);
    } else if (response) {
      var messages = response.messages.map(function(message) {
        return new Message(this.campfire, message);
      }, this);
    }

    callback(null, messages);
  }.bind(this));
};

Room.prototype.tweet = function(url, callback) {
  this.message(url, "TweetMessage", callback);
};

Room.prototype.unlock = function(callback) {
  this.post("/unlock", "", callback);
};

Room.prototype.uploads = function(callback) {
  this.get("/uploads", function(error, response) {
    if (error) {
      return callback(error);
    } else if (response) {
      var uploads = response.uploads;
    }

    callback(null, uploads);
  });
};

Room.prototype.get = function(path, callback) {
  this.campfire.get(this.path + path, callback);
};

Room.prototype.post = function(path, body, callback) {
  this.campfire.post(this.path + path, body, callback);
};

exports.Room = Room;
