import React, { useState } from 'react';

const Login = ({ loginUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) return alert("Enter a username and password!");

        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            loginUser(username);
        } else {
            alert("Login failed");
        }
    };

    return (
        <div>
            <h3>Přihlášení</h3>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
            />
            <button onClick={handleLogin}>Přihlásit</button>
        </div>
    );
};

export default Login;
