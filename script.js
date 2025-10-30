Pusher.logToConsole = true;

const backendURL = "https://websocket-back-wil.onrender.com";
let username = prompt("👤 Ingresa tu nombre:");
let currentChannel = null;

const pusher = new Pusher("b6bbf62d682a7a882f41", {
  cluster: "mt1",
  forceTLS: true
});

async function iniciarChat() {
  // 🔹 Pedir al backend que asigne canal automáticamente
  const res = await fetch(`${backendURL}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  const data = await res.json();

  if (data.error) {
    alert("❌ " + data.error);
    return;
  }

  currentChannel = data.channel;

  // 🔹 Mostrar canal en pantalla
  document.getElementById("canal-info").innerText = `📡 Estás en: ${currentChannel}`;

  // 🔹 Suscribirse a ese canal
  const channel = pusher.subscribe(currentChannel);
  channel.bind("new-message", function (data) {
    mostrarMensaje(data.sender, data.message, data.timestamp);
  });

  // 🔹 Cargar mensajes guardados
  const msgs = await fetch(`${backendURL}/messages/${currentChannel}`).then(r => r.json());
  msgs.forEach(m => mostrarMensaje(m.username, m.message, m.timestamp));
}

document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const message = document.getElementById("message").value.trim();
  if (!message) return;

  await fetch(`${backendURL}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: username,
      message,
      channel: currentChannel
    })
  });

  document.getElementById("message").value = "";
});

function mostrarMensaje(sender, message, timestamp) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(sender === username ? "own" : "other");
  msg.innerHTML = `<strong>${sender}</strong>: ${message} <div class="time">${timestamp}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🚀 Iniciar automáticamente
iniciarChat();
