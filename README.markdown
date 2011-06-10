# node-campfire

Use node.js to interact with Campfire.

## Example

1. Install [node.js](https://github.com/ry/node).
2. Change `YOUR_ACCOUNT`, `YOUR_TOKEN` and `ROOM_ID` in [examples/ping.js](https://github.com/tristandunn/node-campfire/blob/master/examples/ping.js).
3. Run the example with `node examples/ping.js`.
4. Send a "PING" message to the room you set in the configuration via the web interface.

### Sample Output

~~~ bash
$ node examples/ping.js
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
}
~~~

## License

node-campfire uses the MIT license. See LICENSE for more details.
