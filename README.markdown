# node-campfire

Use node.js to interact with Campfire chat rooms.

## Example

1. Install [node.js](http://nodejs.org).
2. Change <code>YOUR_ACCOUNT</code>, <code>YOUR_TOKEN</code> and <code>ROOM_ID</code> in [examples/ping.js](http://github.com/tristandunn/node-campfire/blob/master/examples/ping.js).
3. Run the example with <code>node examples/ping.js</code>.
4. Send a "PING" message to the room you set in the configuration via the web interface.

### Sample Output

<pre>$ node examples/ping.js
PING received.
PONG sent at 2010/01/13 01:00:00 +0000.
Received unknown message:
{
 "body": "PONG",
 "type": "TextMessage",
 "id": 1,
 "user_id": 1,
 "room_id": 1,
 "created_at": "2010-01-13 01:00:00"
}</pre>

## Known Issues

* The web interface stops updating for the user once a message is sent.

## To-Do

* Support more API methods.
* Add users to cache when joining.
* Remove users from cache when leaving.
