const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });
let userCount = 0;

wss.on("connection", (ws) => {
  userCount++;
  const userId = `User${userCount}`;

  ws.send(JSON.stringify({ type: "system", message: `Welcome, ${userId}!` }));

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    const broadcastMessage = {
      user: parsedMessage.user || userId,
      message: parsedMessage.message,
    };

    // Рассылаем сообщение всем подключённым клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(broadcastMessage));
      }
    });
  });

  ws.on("close", () => {
    console.log(`${userId} disconnected`);
  });
});
