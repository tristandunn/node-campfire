var http          = require('http');
var DOMAIN        = null;
var AUTHORIZATION = null;

this.initialize = function(options) {
  this.token    = options.token;
  this.account  = options.account;
  this.room_id  = options.room_id;
  DOMAIN        = this.account + '.campfirenow.com';
  AUTHORIZATION = require('../vendor/base64').encode(this.token + ':x');
};

this.join = function(id, callback) {
  if (typeof(id) == 'function') {
    callback = id;
    id       = this.room_id;
  }

  Client.post('/room/' + id + '/join', '', callback);
};

this.listen = function(id, callback) {
  if (typeof(id) == 'function') {
    callback = id;
    id       = this.room_id;
  }

  var client  = http.createClient(80, 'streaming.campfirenow.com');
  var headers = {
    'Host'          : 'streaming.campfirenow.com',
    'Authorization' : AUTHORIZATION
  };
  var request = client.request('GET', '/room/' + id + '/live.json', headers);

  request.finish(function(response) {
    response.setBodyEncoding('utf8');
    response.addListener('body', function(chunk) {
      if (chunk == ' ') {
        return;
      }

      if (callback) {
        chunk = chunk.split("\r");

        for (var i = 0; i < chunk.length; ++i) {
          if (chunk[i] != '') {
            callback(JSON.parse(chunk[i]));
          }
        }
      }
    });
  });
};

this.say = function(id, text, callback) {
  if (typeof(id) == 'string') {
    callback = text;
    text     = id;
    id       = this.room_id;
  }

  var message = { message : { body : text } };

  Client.post('/room/' + id + '/speak', message, function(chunk) {
    if (typeof(callback) == 'function') {
      callback(JSON.parse(chunk));
    }
  });
};

var Client = {
  post: function(path, body, callback) {
    if (typeof(body) != 'string') {
      body = JSON.stringify(body);
    }

    var headers = {
      'Authorization'  : AUTHORIZATION,
      'Host'           : DOMAIN,
      'Content-Type'   : 'application/json',
      'Content-Length' : body.length
    }

    var client  = http.createClient(80, DOMAIN);
    var request = client.request('POST', path, headers);

    request.sendBody(body);
    request.finish(function(response) {
      response.addListener('body', callback);
    });
  }
};
