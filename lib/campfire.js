var Room    = require("./campfire/room").Room,
    Message = require("./campfire/message").Message;

var Campfire = function(options) {
  var options = options || {},
      ssl     = !!options.ssl;

  if (!options.token)   { throw new Error("Please provide an API token."); }
  if (!options.account) { throw new Error("Please provide an account name."); }

  this.http          = ssl ? require("https") : require("http");
  this.port          = ssl ? 443 : 80;
  this.domain        = options.account + ".campfirenow.com";
  this.authorization = "Basic " + new Buffer(options.token + ":x").toString("base64");
};

Campfire.prototype.join = function(id, callback) {
  this.room(id, function(error, room) {
    if (error) {
      return callback(error);
    }

    room.join(function(error) {
      callback(error, room);
    });
  });
};

Campfire.prototype.me = function(callback) {
  this.get("/users/me", callback);
};

Campfire.prototype.presence = function(callback) {
  this.get("/presence", function(error, response) {
    if (response) {
      var rooms = response.rooms.map(function(room) {
        return new Room(this, room);
      }, this);
    }

    callback(error, rooms);
  }.bind(this));
};

Campfire.prototype.rooms = function(callback) {
  this.get("/rooms", function(error, response) {
    if (response) {
      var rooms = response.rooms.map(function(room) {
        return new Room(this, room);
      }, this);
    }

    callback(error, rooms);
  }.bind(this));
};

Campfire.prototype.room = function(id, callback) {
  this.get("/room/" + id, function(error, response) {
    if (response) {
      var room = new Room(this, response.room);
    }

    callback(error, room);
  }.bind(this));
};

Campfire.prototype.search = function(term, callback) {
  this.get("/search/" + term, function(error, response) {
    if (response) {
      var messages = response.messages.map(function(message) {
        return new Message(this, message);
      }, this);
    }

    callback(error, messages);
  }.bind(this));
};

Campfire.prototype.user = function(id, callback) {
  this.get("/users/" + id, callback);
};

Campfire.prototype.delete = function(path, callback) {
  this.request("DELETE", path, "", callback);
};

Campfire.prototype.get = function(path, callback) {
  this.request("GET", path, null, callback);
};

Campfire.prototype.post = function(path, body, callback) {
  this.request("POST", path, body, callback);
};

Campfire.prototype.request = function(method, path, body, callback) {
  var headers = {
    "Authorization" : this.authorization,
    "Host"          : this.domain,
    "Content-Type"  : "application/json"
  };

  if (method == "POST" || method == "DELETE") {
    if (typeof(body) != "string") {
      body = JSON.stringify(body);
    }

    body = new Buffer(body);

    headers["Content-Length"] = body.length;
  }

  var options = {
    host    : this.domain,
    port    : this.port,
    method  : method,
    path    : path,
    headers : headers
  };

  var request = this.http.request(options, function(response) {
    if (callback instanceof Function) {
      var data = "";

      response.on("data", function(chunk) {
        data += chunk;
      });
      response.on("end", function() {
        if (!data.trim()) {
          return callback(null, {});
        }

        try {
          data = JSON.parse(data);
        } catch(e) {
          return callback(new Error("Invalid JSON response."));
        }

        callback(null, data);
      });
    }
  });

  if (method == "POST") {
    request.write(body);
  }

  request.end();
};

exports.Campfire = Campfire;
