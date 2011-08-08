var Message = function(campfire, data) {
  this.id        = data.id;
  this.body      = data.body;
  this.type      = data.type;
  this.roomId    = data.room_id;
  this.userId    = data.user_id;
  this.tweet     = data.tweet;
  this.createdAt = new Date(data.created_at);

  this.path     = "/messages/" + this.id;
  this.campfire = campfire;
};

Message.prototype.star = function(callback) {
  this.post("/star", null, callback);
};

Message.prototype.unstar = function(callback) {
  this.delete("/star", callback);
};

Message.prototype.delete = function(path, callback) {
  this.campfire.delete(this.path + path, callback);
};

Message.prototype.post = function(path, body, callback) {
  this.campfire.post(this.path + path, body, callback);
};

exports.Message = Message;
