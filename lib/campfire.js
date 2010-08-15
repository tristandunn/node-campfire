var HTTP   = require('http');
var encode = require('../vendor/base64').encode;

var Campfire = {
  initialize: function(options) {
    this.ssl           = options.ssl;
    this.port          = this.ssl ? 443 : 80;
    this.token         = options.token;
    this.account       = options.account;
    this.domain        = this.account + '.campfirenow.com';
    this.authorization = 'Basic ' + encode(this.token + ':x');
  },

  Room: function(id) {
    var self = this;

    return {
      users: [],

      join: function(callback) {
        self.post('/room/' + id + '/join', '', callback);
      },

      leave: function(callback) {
        self.post('/room/' + id + '/leave', '', callback);
      },

      listen: function(callback) {
        if (typeof(callback) != 'function') {
          throw new Error('A callback must be provided for listening.');
        };

        var client  = HTTP.createClient(self.port, 'streaming.campfirenow.com', self.ssl);
        var headers = {
          'Host'          : 'streaming.campfirenow.com',
          'Authorization' : self.authorization
        };

        var request = client.request('GET', '/room/' + id + '/live.json', headers);
        request.on('response', function(response) {
          response.setEncoding('utf8');
          response.on('data', function(chunk) {
            if (chunk == ' ') {
              return;
            }

            chunk = chunk.split("\r");

            for (var i = 0; i < chunk.length; ++i) {
              if (chunk[i] != '') {
                callback(JSON.parse(chunk[i]));
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

        self.post('/room/' + id + '/speak', message, callback);
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
  },

  Rooms: function(callback) {
    this.get('/rooms', callback);
  },

  User: function(id, callback) {
    this.get('/users/' + id, callback);
  },

  me: function(callback) {
    this.get('/users/me', callback);
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

    var client  = HTTP.createClient(this.port, this.domain, this.ssl);
    var request = client.request(method, path, headers);

    if (typeof(callback) == 'function') {
      request.on('response', function(response) {
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
      });
    }

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

exports.Campfire = Campfire;
