import React, { useState } from 'react';

const Register = ({ setIsRegistered }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !password) return alert("Enter a username and password!");

        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            setIsRegistered(true);
        } else {
            alert("Registration failed");
        }
    };

    return (
        <div>
            <h3>Registrace</h3>
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
            <button onClick={handleRegister}>Registrovat</button>
        </div>
    );
};

export default Register;
