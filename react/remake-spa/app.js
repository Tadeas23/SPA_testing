import React, { useState } from 'react';
import Login from './components/login';
import Register from './components/register';
import Chat from './components/chat';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const loginUser = (username) => {
        setCurrentUser(username);
    };

    const logoutUser = () => {
        setCurrentUser(null);
    };

    return (
        <div className="App">
            {!currentUser ? (
                <>
                    {!isRegistered ? (
                        <Register setIsRegistered={setIsRegistered} />
                    ) : (
                        <Login loginUser={loginUser} />
                    )}
                </>
            ) : (
                <Chat currentUser={currentUser} logoutUser={logoutUser} />
            )}
        </div>
    );
}

export default App;
