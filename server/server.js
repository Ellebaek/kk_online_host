/*server.js*/
/* 'use strict'; */

const default_port = 3000;

const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', onConnection);

function onConnection(sock) {
  sock.emit('msg', 'Velkommen til chatten!');

  /* set up event listener to get message and send it back to all users */
  sock.on('msg', (txt) => io.emit('msg', txt));
}

server.on('error', (err) => {
  console.error('Server error:', err);
});
/*
function notifyHandStarts(sock) {
  sock.emit..
}
*/
/*
const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});
*/

app.use(express.static(__dirname + '/../client'));

var port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = default_port;
}

server.listen(port, () => {
  console.log('Serving on port: ' + port)
});
