# node-campfire

Use node.js to interact with Campfire chat rooms.

## Example

1. Install [node.js](http://nodejs.org).
2. Change the configuration in <code>examples/ping.js</code>.
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
* Support other message types.
* Option to ignore messages from the current user when listening.
* Automatically look-up, cache, and merge user and room information into responses.
