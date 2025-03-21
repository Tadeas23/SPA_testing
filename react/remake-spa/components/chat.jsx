import React, { useState, useEffect } from 'react';

const Chat = ({ currentUser, logoutUser }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');
        setSocket(ws);

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        return () => ws.close();
    }, []);

    const sendMessage = () => {
        if (message && socket) {
            const msgData = { user: currentUser, text: message };
            socket.send(JSON.stringify(msgData));
            setMessage('');
        }
    };

    return (
        <div>
            <h3>Chat</h3>
            <button onClick={logoutUser}>Odhlásit se</button>
            <div id="messages">
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
                ))}
            </div>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type a message..." 
            />
            <button onClick={sendMessage}>Poslat</button>
        </div>
    );
};

export default Chat;
