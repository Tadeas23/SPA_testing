import React, { useState } from "react";

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setCurrentUser(username);
    } else {
      alert("Neplatné přihlašovací údaje");
    }
  };

  return (
    <div>
      <h3>Přihlášení</h3>
      <input type="text" placeholder="Uživatelské jméno" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Přihlásit</button>
    </div>
  );
};

export default Login;
