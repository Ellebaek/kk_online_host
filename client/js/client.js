var sock = io();

sock.on('msg', onMessage);
sock.on('usrname', onUserNameUpdate);

function onMessage(text) {
  var list = document.getElementById('chat');
  var el = document.createElement('li');
  el.innerHTML = text;
  list.appendChild(el);
}

function onUserNameUpdate(text) {
  var par = document.getElementById('user-name');
  par.innerHTML = text;
}

var form = document.getElementById('chat-form');
form.addEventListener('submit', function(e) {
  var usr = "Unknown";
  var par = document.getElementById('user-name');
  if (par.innerHTML) {
    usr = par.innerHTML;
  }

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
  input.value = '';
  // only update on client, do not share via server
  onUserNameUpdate(value);
  //sock.emit('usrname', value);

  // prevent refresh
  e.preventDefault();
});
