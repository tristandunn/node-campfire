var Campfire = function(options) {
  this.ssl           = options.ssl;
  this.http          = this.ssl ? require('https') : require('http');
  this.port          = this.ssl ? 443 : 80;
  this.token         = options.token;
  this.account       = options.account;
  this.domain        = this.account + '.campfirenow.com';
  this.authorization = 'Basic ' + new Buffer(this.token + ':x').toString('base64');
};

Campfire.prototype.me = function(callback) {
  this.get('/users/me', callback);
};

Campfire.prototype.presence = function(callback) {
  var self = this;

  this.get('/presence', function(data) {
    callback(data.rooms.map(function(room) {
      return new Campfire.Room(self, room);
    }));
  });
};

Campfire.prototype.rooms = function(callback) {
  var self = this;

  this.get('/rooms', function(data) {
    if (typeof data != 'object') {
      throw new Error('The call to Campfire.rooms failed. Verify that your credentials are correct.');
    }

    callback(data.rooms.map(function(room) {
      return new Campfire.Room(self, room);
    }));
  });
};

Campfire.prototype.room = function(id, callback) {
  if (typeof(callback) != 'function') {
    throw new Error('A callback must be provided for retrieving a room.');
  }

  this.get('/room/' + id, function(data) {
    callback(new Campfire.Room(this, data.room));
  }.bind(this));
};

Campfire.prototype.search = function(term, callback) {
  this.get('/search/' + term, function(data) {
    callback(data.messages);
  });
};

Campfire.prototype.user = function(id, callback) {
  this.get('/users/' + id, callback);
};

Campfire.prototype.get = function(path, callback) {
  this.request('GET', path, null, callback);
};

Campfire.prototype.post = function(path, body, callback) {
  this.request('POST', path, body, callback);
};

Campfire.prototype.request = function(method, path, body, callback) {
  var headers = {
    'Authorization' : this.authorization,
    'Host'          : this.domain,
    'Content-Type'  : 'application/json'
  };

  if (method == 'POST') {
    if (typeof(body) != 'string') {
      body = JSON.stringify(body);
    }

    headers['Content-Length'] = body.length;
  }

  var options = {
    host    : this.domain,
    port    : this.port,
    method  : method,
    path    : path,
    headers : headers
  };

  var request = this.http.request(options, function(response) {
    if (typeof(callback) == 'function') {
      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        try {
          data = JSON.parse(data);
        } catch(e) {}

        callback(data);
      });
    }
  });

  if (method == 'POST') {
    request.write(body);
  }

  request.end();
};

Campfire.Room = function(campfire, data) {
  this.id              = data.id;
  this.name            = data.name;
  this.topic           = data.topic;
  this.locked          = data.locked;
  this.createdAt       = data.created_at;
  this.updatedAt       = data.updated_at;
  this.membershipLimit = data.membership_limit;

  this.path     = '/room/' + this.id;
  this.campfire = campfire;
};

Campfire.Room.prototype.join = function(callback) {
  this.post('/join', '', callback);
};

Campfire.Room.prototype.leave = function(callback) {
  this.post('/leave', '', callback);
};

Campfire.Room.prototype.listen = function(callback) {
  if (typeof(callback) != 'function') {
    throw new Error('A callback must be provided for listening.');
  }

  var
  campfire = this.campfire,
  options  = {
    host    : 'streaming.campfirenow.com',
    port    : campfire.port,
    method  : 'GET',
    path    : this.path + '/live.json',
    headers : {
      'Host'          : 'streaming.campfirenow.com',
      'Authorization' : campfire.authorization
    }
  };

  campfire.http.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      if (!data.trim()) {
        return;
      }

      var chunks = data.split("\r");

      for (var i = 0; i < chunks.length; ++i) {
        var chunk = chunks[i].trim();

        if (chunk) {
          try {
            callback(JSON.parse(chunk));
          } catch(e) {}
        }
      }
    });
  }).end();
};

Campfire.Room.prototype.lock = function(callback) {
  this.post('/lock', '', callback);
};

Campfire.Room.prototype.message = function(text, type, callback) {
  this.post('/speak', { message : { body : text, type : type } }, callback);
};

Campfire.Room.prototype.paste = function(text, callback) {
  this.message(text, 'PasteMessage', callback);
};

Campfire.Room.prototype.messages = function(callback) {
  this.get('/recent', function(data) {
    callback(data.messages);
  });
};

Campfire.Room.prototype.show = function(callback) {
  this.post('', '', callback);
};

Campfire.Room.prototype.sound = function(text, callback) {
  this.message(text, 'SoundMessage', callback);
};

Campfire.Room.prototype.speak = function(text, callback) {
  this.message(text, 'TextMessage', callback);
};

Campfire.Room.prototype.transcript = function(date, callback) {
  if (date instanceof Date) {
    this.get('/transcript/' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate(), callback);
  } else if (date instanceof Function) {
    this.get('/transcript', date);
  }
};

Campfire.Room.prototype.tweet = function(url, callback) {
  this.message(url, 'TweetMessage', callback);
};

Campfire.Room.prototype.unlock = function(callback) {
  this.post('/unlock', '', callback);
};

Campfire.Room.prototype.uploads = function(callback) {
  this.get('/uploads', function(data) {
    callback(data.uploads);
  });
};

Campfire.Room.prototype.get = function(path, callback) {
  this.campfire.get(this.path + path, callback);
};

Campfire.Room.prototype.post = function(path, body, callback) {
  this.campfire.post(this.path + path, body, callback);
};

exports.Campfire = Campfire;
