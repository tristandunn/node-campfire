# node-campfire

Use node.js to interact with Campfire chat rooms.

## Example

1. Install [node.js](http://github.com/ry/node).
2. Change `YOUR_ACCOUNT`, `YOUR_TOKEN` and `ROOM_ID` in [examples/ping.js](http://github.com/tristandunn/node-campfire/blob/master/examples/ping.js).
3. Run the example with `node examples/ping.js`.
4. Send a "PING" message to the room you set in the configuration via the web interface.

### Sample Output

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

## To-do

* Better error handling.
* Support more API methods.

## Contributors

* [Aaron Quint](http://github.com/quirkey)
* [Jon Ursenbach](http://github.com/jonursenbach)

## License

The MIT License

Copyright (c) 2011 Tristan Dunn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
