Pusher.logToConsole = true;

const username = "cliente1"; // 🔹 Nombre de este cliente
const backendURL = "https://websocket-back-wil.onrender.com"; // ⚙️ Tu backend en Render

const pusher = new Pusher("b6bbf62d682a7a882f41", {
  cluster: "mt1",
  forceTLS: true
});

const channel = pusher.subscribe("my-channel");

// 📥 Escuchar mensajes en tiempo real
channel.bind("my-event", function (data) {
  mostrarMensaje(data.sender, data.message, data.timestamp);
});

// 📦 Cargar mensajes guardados al iniciar
window.onload = () => {
  fetch(`${backendURL}/messages`)
    .then(res => res.json())
    .then(data => {
      data.forEach(msg => {
        mostrarMensaje(msg.username, msg.message, msg.timestamp);
      });
    });
};

// 📤 Enviar mensaje al backend Flask
document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const message = document.getElementById("message").value.trim();
  if (!message) return;

  fetch(`${backendURL}/send`, { // ✅ se cambió "/" por "/send"
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: username, message })
  });

  document.getElementById("message").value = "";
});

// 🪄 Función para mostrar mensajes
function mostrarMensaje(sender, message, timestamp) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.classList.add("message");

  if (sender === username) {
    msg.classList.add("own");
  } else {
    msg.classList.add("other");
  }

  msg.innerHTML = `
    <strong>${sender}</strong>: ${message}
    <div class="time">${timestamp}</div>
  `;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
