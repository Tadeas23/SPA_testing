import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("Registrace úspěšná!");
    } else {
      alert("Chyba při registraci");
    }
  };

  return (
    <div>
      <h3>Registrace</h3>
      <input type="text" placeholder="Uživatelské jméno" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrovat</button>
    </div>
  );
};

export default Register;
