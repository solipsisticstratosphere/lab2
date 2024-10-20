import React, { useState, useEffect } from "react";
import UserNameForm from "./UserNameForm";
import MessageForm from "./MessageForm";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const Chat = () => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null; // Загружаем имя пользователя из localStorage
  });
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : []; // Загружаем историю сообщений
  });

  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.error(`Connection error: ${err.message}`);
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Сохраняем обновленную историю в localStorage
        return updatedMessages;
      });
    });

    return () => {
      socket.off("message");
      socket.off("connect_error");
    };
  }, []);

  const handleUserSubmit = (name) => {
    setUsername(name);
    localStorage.setItem("username", name); // Сохраняем имя пользователя в localStorage
    socket.emit("newUser", name);
  };

  const handleSendMessage = (message) => {
    const msgData = { username, message };
    socket.emit("message", msgData);
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, msgData];
      localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Сохраняем обновленную историю в localStorage
      return updatedMessages;
    });
  };

  const handleLeaveChat = () => {
    setUsername(null);
    localStorage.removeItem("username"); // Удаляем имя пользователя из localStorage
    setMessages([]); // Очищаем историю сообщений
    localStorage.removeItem("messages"); // Удаляем историю сообщений из localStorage
    socket.emit("disconnect"); // Отправляем уведомление серверу о выходе
  };

  return (
    <div>
      {!username ? (
        <UserNameForm onSubmit={handleUserSubmit} />
      ) : (
        <div>
          <h2>Welcome, {username}!</h2>
          <button onClick={handleLeaveChat}>Leave Chat</button>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <MessageForm onSend={handleSendMessage} />
        </div>
      )}
    </div>
  );
};

export default Chat;
