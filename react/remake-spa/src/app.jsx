import React, { useState } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/register.jsx";
import Chat from "./components/chat.jsx";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div>
      <h2>Chat Aplikace</h2>
      {!currentUser ? (
        <>
          <Login setCurrentUser={setCurrentUser} />
          <Register />
        </>
      ) : (
        <Chat currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
    </div>
  );
};

export default App;
