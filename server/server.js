/*server.js*/
/* 'use strict'; */

const default_port = 3000;

const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var playerOrder = []; // playing order
var sockets = {}; // all player sockets
var players = []; // all registered players
var oderedPlayers = [];
var chips = {}; // all player stacks
var currenthand = {}; // all player hands
var currentboard = {}; // cards on table
var currentpot = 0; // chips in pot
io.on('connection', onConnection);

//function getPlayerList() {
//  var result = [];
//  for (var i=0; i<playerOrder.length; i++) {
//    result.push(players[playerOrder]);
//
//  }
//}

function onConnection(sock) {
  sock.emit('msg', 'Velkommen til KK Online Host!');
  sock.emit('msg', 'Once ALL players have joined the game please register by setting your name!');

  /* set up event listener to get message and send it back to all users */
  sock.on('msg', (txt) => io.emit('msg', txt));
  //sock.on('usrname', (txt) => io.emit('usrname', txt));
  sock.on('usrchips', (obj) => io.emit('usrchips', obj));
  sock.on('playersshuffle', function (txt) {
    var temparray = [];
    for (var i=0; i<Object.keys(players).length; i++) {
      temparray.push(i);
    }
    for (var i=0; i<Object.keys(players).length; i++) {
      var randomIndex = Math.floor(Math.random()*temparray.length);
      playerOrder.push(temparray[randomIndex]);
      temparray.splice(randomIndex, 1);
    }
    console.log(players);
    console.log(playerOrder);
    var result = [];
    for (var i=0; i<playerOrder.length; i++) {
      result.push(players[playerOrder[i]]);
    }
    console.log(result);
    io.emit('playersshuffle', result);
  });

  // register new player
  sock.on('usrname', function (txt)
  {
    sock.usrname = txt;
    sockets[sock.usrname] = sock;
    players.push(sock.usrname);
    io.emit('usrname', txt);
  });
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
