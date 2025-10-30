Pusher.logToConsole = true;

const backendURL = "https://websocket-back-wil.onrender.com";
let username = prompt("👤 Ingresa tu nombre:");
let currentChannel = null;

const pusher = new Pusher("b6bbf62d682a7a882f41", {
  cluster: "mt1",
  forceTLS: true
});

// 🔹 Función para iniciar chat
async function iniciarChat() {
  // Pedir canal al backend
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

  currentChannel = data.chat;

  // Mostrar canal y usuario
  document.getElementById("canal-info").innerText = `📡 Canal: ${currentChannel} | Usuario: ${username}`;

  // Suscribirse al canal
  const channel = pusher.subscribe(currentChannel);
  channel.bind("new-message", function(msg) {
    mostrarMensaje(msg.sender, msg.message, msg.timestamp);
  });

  // Cargar mensajes guardados
  const msgs = await fetch(`${backendURL}/messages/${currentChannel}`).then(r => r.json());
  msgs.forEach(m => mostrarMensaje(m.username, m.message, m.timestamp));
}

// Enviar mensaje
document.getElementById("form").addEventListener("submit", async function(e) {
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

// Mostrar mensaje en chat
function mostrarMensaje(sender, message, timestamp) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(sender === username ? "own" : "other");
  msg.innerHTML = `<strong>${sender}</strong>: ${message} <div class="time">${timestamp}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Iniciar automáticamente
iniciarChat();
