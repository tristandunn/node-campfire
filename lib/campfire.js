var HTTP   = require('http');
var encode = require('../vendor/base64').encode;

this.Campfire = {
  initialize: function(options) {
    this.token         = options.token;
    this.account       = options.account;
    this.domain        = this.account + '.campfirenow.com';
    this.authorization = encode(this.token + ':x');
  },

  Room: function(id) {
    var self   = this;
    var result = {
      join: function(callback) {
        self.post('/room/' + id + '/join', '', callback);
      },
      leave: function(callback) {
        self.post('/room/' + id + '/leave', '', callback);
      },
      listen: function(callback) {
        var client  = HTTP.createClient(80, 'streaming.campfirenow.com');
        var headers = {
          'Host'          : 'streaming.campfirenow.com',
          'Authorization' : self.authorization
        };

        var
        request = client.request('GET', '/room/' + id + '/live.json', headers);
        request.addListener('response', function(response) {
          response.setEncoding('utf8');
          response.addListener('data', function(chunk) {
            if (chunk == ' ') {
              return;
            }

            if (typeof(callback) == 'function') {
              chunk = chunk.split("\r");

              for (var i = 0; i < chunk.length; ++i) {
                if (chunk[i] != '') {
                  var message = JSON.parse(chunk[i]);

                  try {
                    message.user = result.users[message.user_id];
                  } catch(e) {}

                  if (message.type == 'EnterMessage') {
                    exports.Campfire.User(message.user_id, function(data) {
                      result.users[message.user_id] = data.user;
                    });
                  } else if (message.type == 'LeaveMessage') {
                    delete result.users[message.user_id];
                  }

                  callback(message);
                }
              }
            }
          });
        });
        request.end();
      },
      lock: function(callback) {
        self.post('/room/' + id + '/lock', '', callback);
      },
      message: function(text, type, callback) {
        var message = { message : { body : text, type : type } };

        self.post('/room/' + id + '/speak', message, function(data) {
          if (typeof(callback) == 'function') {
            callback(data);
          }
        });
      },
      paste: function(text, callback) {
        this.message(text, 'PasteMessage', callback);
      },
      show: function(callback) {
        self.post('/room/' + id, '', callback);
      },
      sound: function(text, callback) {
        this.message(text, 'SoundMessage', callback);
      },
      speak: function(text, callback) {
        this.message(text, 'TextMessage', callback);
      },
      unlock: function(callback) {
        self.post('/room/' + id + '/unlock', '', callback);
      }
    };

    result.show(function(data) {
      var room = data.room;

      for (var key in room) {
        result[key] = room[key];
      }

      result.users = {};

      for (var i = 0, l = room.users.length; i < l; i++) {
        var user = room.users[i];

        result.users[user.id] = user;
      }
    });

    return result;
  },

  User: function(id, callback) {
    this.get('/users/' + id, callback);
  },

  request: function(method, path, body, callback) {
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

    var client  = HTTP.createClient(80, this.domain);
    var request = client.request(method, path, headers);

    request.addListener('response', function(response) {
      if (typeof(callback) == 'function') {
        var data = '';

        response.addListener('data', function(chunk) {
          data += chunk;
        });
        response.addListener('end', function() {
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
  },

  get: function(path, callback) {
    this.request('GET', path, null, callback);
  },

  post: function(path, body, callback) {
    this.request('POST', path, body, callback);
  }
};
