const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Настройка CORS с указанием origin вашего клиента
const corsOptions = {
  origin: "http://localhost:3000", // Убедитесь, что порт клиента совпадает
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Убедитесь, что здесь также указан правильный клиентский URL
    methods: ["GET", "POST"],
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  // Когда новый пользователь присоединяется
  socket.on("newUser", (name) => {
    users.push({ id: socket.id, name });
    io.emit("message", {
      username: "System",
      message: `${name} joined the chat`,
    });
  });

  // Получение сообщения от пользователя
  socket.on("message", (data) => {
    io.emit("message", data); // Рассылаем сообщение всем пользователям
  });

  // Удаляем пользователя при отключении
  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = users.find((u) => u.id === socket.id);
    if (user) {
      io.emit("message", {
        username: "System",
        message: `${user.name} left the chat`,
      });
      users = users.filter((u) => u.id !== socket.id);
    }
  });
});

// Укажите порт, на котором будет работать сервер
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
