var HTTP   = require('http');
var encode = require('../vendor/base64').encode;

var Campfire = {
  initialize: function(options) {
    this.token         = options.token;
    this.account       = options.account;
    this.domain        = this.account + '.campfirenow.com';
    this.authorization = encode(this.token + ':x');
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

    if (typeof(callback) == 'function') {
      request.addListener('response', function(response) {
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
