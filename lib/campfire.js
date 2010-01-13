var http = require('http');

this.initialize = function(options) {
  this.token   = options.token;
  this.account = options.account;
  this.domain  = this.account + '.campfirenow.com';
  this.room_id = options.room_id;
  this.headers = {
    'Authorization' : require('../vendor/base64').encode(this.token + ':x')
  };
};

this.listen = function(id, callback) {
  if (typeof(id) == 'function') {
    callback = id;
    id       = this.room_id;
  }

  var client  = http.createClient(80, 'streaming.campfirenow.com');
  var headers = this.headers;
      headers['Host'] = 'streaming.campfirenow.com';
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

this.say = function(id, body, callback) {
  if (typeof(id) == 'string') {
    callback = body;
    body     = id;
    id       = this.room_id;
  }

  var client  = http.createClient(80, this.domain);
  var message = JSON.stringify({ 'message' : { 'body' : body } });
  var headers = this.headers;
      headers['Host']           = this.domain;
      headers['Content-Type']   = 'application/json';
      headers['Content-Length'] = message.length;
  var request = client.request('POST', '/room/' + id + '/speak', headers);

  request.sendBody(message);
  request.finish(function(response) {
    response.addListener('body', function(chunk) {
      if (typeof(callback) == 'function') {
        callback(JSON.parse(chunk));
      }
    });
  });
};
