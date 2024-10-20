import React, { useState, useEffect, useRef } from "react";
import "./Chat.css"; // Подключаем CSS файл

const generateShortId = () => {
  // Генерация короткого идентификатора, длина 6 символов
  return Math.random().toString(36).substr(2, 6);
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(generateShortId()); // Генерируем короткий ID
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      const welcomeMessage = {
        type: "system",
        user: username || userId,
        message: `User ${username || userId} joined the chat`,
      };
      ws.current.send(JSON.stringify(welcomeMessage));
    };

    ws.current.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current.close();
    };
  }, [username, userId]);

  const sendMessage = () => {
    if (input.trim() && ws.current.readyState === WebSocket.OPEN) {
      const messageObject = {
        type: "chat",
        user: username || userId,
        message: input,
      };
      ws.current.send(JSON.stringify(messageObject));
      setInput("");
    }
  };

  const handleJoinChat = () => {
    if (username) {
      setUserId(userId); // сохраняем userId, если необходимо
    }
  };

  return (
    <div className="chat-container">
      <h2>WebSocket Chat</h2>
      {!username ? (
        <div className="join-container">
          <input
            type="text"
            placeholder="Введите ваше имя"
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
          />
          <button onClick={handleJoinChat} className="join-button">
            Войти в чат
          </button>
        </div>
      ) : (
        <>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <strong>{msg.user ? msg.user.slice(0, 6) : "Unknown"}:</strong>{" "}
                {msg.message || "Сообщение отсутствует"}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="message-input"
              placeholder="Ваше сообщение..."
            />
            <button onClick={sendMessage} className="send-button">
              Отправить
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
