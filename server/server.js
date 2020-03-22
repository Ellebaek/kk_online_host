/*server.js*/
/* 'use strict'; */

const default_port = 3000;

const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const Game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', onConnection);



var waiting_players = {};

// todo: implement real dealing
hands = [['spades2', 'clubs7'], ['hearts12', 'hearts3'],['hearts8', 'diamonds10']];

function onConnection(sock) {
  sock.emit('msg', 'Velkommen til KK Online Host!');
  sock.emit('msg', 'Once ALL players have joined the game please register by setting your name!');

  /* set up event listener to get message and send it back to all users */
  sock.on('msg', (txt) => io.emit('msg', txt));
  //sock.on('usrname', (txt) => io.emit('usrname', txt));
  sock.on('usrchips', (obj) => io.emit('usrchips', obj));
  sock.on('playersshuffle', function (txt) {
    var players = Object.keys(waiting_players);
    var playerOrder = [];
    var temparray = [];
    for (var i=0; i<players.length; i++) {
      temparray.push(i);
    }
    for (var i=0; i<players.length; i++) {
      var randomIndex = Math.floor(Math.random()*temparray.length);
      playerOrder.push(temparray[randomIndex]);
      temparray.splice(randomIndex, 1);
    }
    var result = [];
    for (var i=0; i<playerOrder.length; i++) {
      result.push(players[playerOrder[i]]);
    }
    console.log(playerOrder);
    console.log(result);
    orderedPlayers = result;
    // new Game(sockets, players...);
    new Game(waiting_players, orderedPlayers);
    Object.values(waiting_players).forEach((item, i) => {
      item.emit('playersshuffle', orderedPlayers);
    });
    waiting_players = {};
  });

  // register new player
  sock.on('usrname', function (name) {
    waiting_players[name] = sock;
    io.emit('usrname', name);
  });

  // start new hand
  sock.on('deal', function (txt) {
    for (var i=0; i<playerOrder.length; i++) {
      io.to(sockets[orderedPlayers[i]]).emit('hand', hands[i]);
    }
  });

  // todo: figure out how to unregister players
  //sock.on('disconnect', function () {
  //  delete sockets[sock.usrname];
  //});
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
