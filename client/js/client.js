var sock = io();

const user_suffix = '_PLAYER';
sock.on('msg', onMessage);
sock.on('usrname', onRegisterUser);
sock.on('usrchips', onChipsUpdate);

function onMessage(text) {
  var list = document.getElementById('chat');
  var el = document.createElement('li');
  el.innerHTML = text;
  list.appendChild(el);
}

function onRegisterUser(text) {
  var list = document.getElementById('users');
  var el = document.createElement('li');
  el.innerHTML = text;
  // consider stripping username for special characters
  el.id = text + user_suffix;
  list.appendChild(el);
}

function onChipsUpdate(obj) {
  var usr = obj['user'] + user_suffix;
  var el = document.getElementById(usr);
  el.innerHTML = obj['user'] + ' (' + obj['chips'] + ')';
}

var form = document.getElementById('chat-form');
form.addEventListener('submit', function(e) {
  usr = document.getElementById('name-input').value;

  var input = document.getElementById('chat-input');
  var value = usr + ': ' + input.value;
  input.value = '';
  sock.emit('msg', value);

  // prevent refresh
  e.preventDefault();
});

var form = document.getElementById('name-form');
form.addEventListener('submit', function(e) {
  var input = document.getElementById('name-input');
  var value = input.value;
  input.disabled = true
  var btn = document.getElementById('name-btn');
  btn.disabled = true

  document.getElementById('chat-input').disabled = false;
  document.getElementById('chat-btn').disabled = false;
  document.getElementById('chips-input').disabled = false;
  document.getElementById('chips-btn').disabled = false;
  // input.value = '';
  // only update on client, do not share via server
  //onUserNameUpdate(value);

  sock.emit('usrname', value);

  // prevent refresh
  e.preventDefault();
});

var form = document.getElementById('chips-form');
form.addEventListener('submit', function(e) {
  var usr = document.getElementById('name-input').value;
  var chps = document.getElementById('chips-input').value;
  //var value = usr + '(' + input.value + ')';
  sock.emit('usrchips', { user: usr, chips: chps});

  // prevent refresh
  e.preventDefault();
});
