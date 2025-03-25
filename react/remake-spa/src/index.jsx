import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [ws, setWs] = useState(null);

    // State pro přihlášení a registraci
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3000");
        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, JSON.parse(event.data)]);
        };
        setWs(socket);
        return () => socket.close();
    }, []);

    const handleLogin = async () => {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        });

        const data = await res.json();
        if (res.ok) {
            setUser(loginUsername);
            document.getElementById("auth").style.display = "none";
            document.getElementById("chat").style.display = "block";
        } else {
            alert(data.message);
        }
    };

    const handleRegister = async () => {
        const res = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: registerUsername, password: registerPassword }),
        });

        const data = await res.json();
        alert(data.message);
    };

    const handleLogout = async () => {
        await fetch("/logout", { method: "POST" });
        setUser(null);
        document.getElementById("auth").style.display = "block";
        document.getElementById("chat").style.display = "none";
    };

    const sendMessage = () => {
        if (ws && message) {
            ws.send(JSON.stringify({ user, text: message }));
            setMessage("");
        }
    };

    return (
        <div>
            {user ? (
                <div>
                    <h2>Chat</h2>
                    <button onClick={handleLogout}>Odhlásit</button>
                    <div id="messages">
                        {messages.map((msg, index) => (
                            <p key={index}><b>{msg.user}:</b> {msg.text}</p>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Zpráva..."
                    />
                    <button onClick={sendMessage}>Odeslat</button>
                </div>
            ) : (
                <div id="auth">
                    <h2>Přihlášení</h2>
                    <input
                        type="text"
                        placeholder="Uživatelské jméno"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Heslo"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Přihlásit</button>
                    <h2>Registrace</h2>
                    <input
                        type="text"
                        placeholder="Uživatelské jméno"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Heslo"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    <button onClick={handleRegister}>Registrovat</button>
                </div>
            )}
        </div>
    );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
