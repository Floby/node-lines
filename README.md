this is a tiny utility function to help processing readable streams line per line with [NodeJS](http://github.com/ry/node)

here is a simple example which explains almost everything

	var lines = require('lines');
	var net = require('net');
	
	net.createServer(function(socket) {
	    socket.setEncoding('utf8');
	    lines(socket); // here is where the magic happens
	    socket.on('line', function(line) {
		// line is one line with no trailing \n or \r
	    });
	}).listen('/tmp/mysock');

lines doesn't work on non-encoded streams. note that you still can listen
to 'data' events on the same stream with no loss of data.

install it via npm
	npm install lines

or get the code from [the repository](http://github.com/Floby/node-lines) and link lines.js from your ~/.node_libraries/

