Pusher.logToConsole = true;

const pusher = new Pusher('b6bbf62d682a7a882f41', {
  cluster: 'mt1',
  forceTLS: true
});

const channel = pusher.subscribe('my-channel');
const chatBox = document.getElementById('chat-box');

// Escuchar mensajes entrantes
channel.bind('my-event', function (data) {
  const msg = document.createElement('div');
  msg.classList.add('message');

  if (data.sender === 'cliente1') {
    msg.classList.add('own');
  } else {
    msg.classList.add('other');
  }

  msg.textContent = `[${data.timestamp}] ${data.sender}: ${data.message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Enviar mensaje
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  const message = document.getElementById('message').value.trim();
  if (!message) return;

  fetch('https://websocket-back-wil.onrender.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sender: 'cliente1' })
  });

  document.getElementById('message').value = '';
});
