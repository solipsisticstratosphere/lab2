import { useState, useEffect } from "react";
import UserNameForm from "./UserNameForm";
import MessageForm from "./MessageForm";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

const Chat = () => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.error(`Connection error: ${err.message}`);
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    socket.on("clearChat", () => {
      setMessages([]);
      localStorage.removeItem("messages");
    });

    return () => {
      socket.off("message");
      socket.off("clearChat");
      socket.off("connect_error");
    };
  }, []);

  const handleUserSubmit = (name) => {
    setUsername(name);
    localStorage.setItem("username", name);
    socket.emit("newUser", name);
  };

  const handleSendMessage = (message) => {
    const msgData = { username, message };
    socket.emit("message", msgData);
  };

  const handleLeaveChat = () => {
    setUsername(null);
    localStorage.removeItem("username");
    setMessages([]);
    localStorage.removeItem("messages");
    socket.disconnect();
  };

  const handleClearChat = () => {
    socket.emit("clearChat");
  };

  return (
    <div className="chat-container">
      {!username ? (
        <UserNameForm onSubmit={handleUserSubmit} />
      ) : (
        <div className="chat">
          <h2 className="welcome-message">Welcome, {username}!</h2>
          <button onClick={handleLeaveChat} className="leave-button">
            Leave Chat
          </button>
          <button onClick={handleClearChat} className="clear-button">
            Clear Chat
          </button>
          <div className="message-container">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong className="username">{msg.username}:</strong>{" "}
                <span className="text">{msg.message}</span>
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
