import { useState, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && ws) {
      ws.send(input);
      setInput("");
    }
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
