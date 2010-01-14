var http = require('http');

this.Campfire = {
  initialize: function(options) {
    this.token         = options.token;
    this.account       = options.account;
    this.domain        = this.account + '.campfirenow.com';
    this.authorization = require('../vendor/base64').encode(this.token + ':x');
  },

  Room: function(id) {
    var self = this;

    return {
      join: function(callback) {
        self.post('/room/' + id + '/join', '', callback);
      },
      leave: function(callback) {
        self.post('/room/' + id + '/leave', '', callback);
      },
      listen: function(callback) {
        var client  = http.createClient(80, 'streaming.campfirenow.com');
        var headers = {
          'Host'          : 'streaming.campfirenow.com',
          'Authorization' : self.authorization
        };

        var
        request = client.request('GET', '/room/' + id + '/live.json', headers);
        request.finish(function(response) {
          response.setBodyEncoding('utf8');
          response.addListener('body', function(chunk) {
            if (chunk == ' ') {
              return;
            }

            if (typeof(callback) == 'function') {
              chunk = chunk.split("\r");

              for (var i = 0; i < chunk.length; ++i) {
                if (chunk[i] != '') {
                  callback(JSON.parse(chunk[i]));
                }
              }
            }
          });
        });
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

  post: function(path, body, callback) {
    if (typeof(body) != 'string') {
      body = JSON.stringify(body);
    }

    var headers = {
      'Authorization'  : this.authorization,
      'Host'           : this.domain,
      'Content-Type'   : 'application/json',
      'Content-Length' : body.length
    }

    var client  = http.createClient(80, this.domain);
    var request = client.request('POST', path, headers);

    request.sendBody(body);
    request.finish(function(response) {
      if (typeof(callback) == 'function') {
        response.addListener('body', function(chunk) {
          var data = null;

          try {
            data = JSON.parse(chunk);
          } catch(e) {}

          callback(data);
        });
      }
    });
  }
};
