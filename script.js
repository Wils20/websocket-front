Pusher.logToConsole = true;

const backendURL = "https://websocket-back-wil.onrender.com";
let username = prompt("👤 Ingresa tu nombre:");
let canalElegido = prompt("📡 Ingresa el canal al que deseas unirte (ejemplo: canal1, canal2, canal3):");

// Si el usuario no escribe nada, entra por defecto al canal1
if (!canalElegido) canalElegido = "canal1";

let currentChannel = canalElegido;

const pusher = new Pusher("b6bbf62d682a7a882f41", {
  cluster: "mt1",
  forceTLS: true
});

async function iniciarChat() {
  // Mostrar el canal en pantalla
  document.getElementById("canal-info").innerText = `📡 Estás en: ${currentChannel}`;

  // Suscribirse al canal
  const channel = pusher.subscribe(currentChannel);
  channel.bind("new-message", function (data) {
    mostrarMensaje(data.sender, data.message, data.timestamp);
  });

  // Cargar mensajes guardados del canal
  const msgs = await fetch(`${backendURL}/messages/${currentChannel}`).then(r => r.json());
  msgs.forEach(m => mostrarMensaje(m.username, m.message, m.timestamp));
}

// Enviar mensaje
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
