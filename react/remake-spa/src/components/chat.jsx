import React, { useEffect, useState } from "react";

const Chat = ({ currentUser, setCurrentUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = new WebSocket("ws://localhost:3000");

  useEffect(() => {
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    const msgData = { user: currentUser, text: message };
    socket.send(JSON.stringify(msgData));
    setMessage("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div>
      <h3>Chat</h3>
      <button onClick={handleLogout}>Odhlásit</button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Napište zprávu..." />
      <button onClick={sendMessage}>Poslat</button>
    </div>
  );
};

export default Chat;
