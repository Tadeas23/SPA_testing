require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let users = []; // Store users in memory
let messages = []; // Store messages in memory

// Serve frontend
app.use(express.static(path.join(__dirname)));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend.html"));
});

// Register a new user (no hashing, storing plain-text password)
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
    }

    // Store the user with the password as plain text
    users.push({ username, password });

    res.status(201).json({ success: true });
});

// Login a user (compare plain-text password)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Find the user
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the password matches
    if (user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({ success: true, message: "Login successful" });
});

// Get all messages
app.get("/messages", (req, res) => {
    res.json(messages);
});

// Send a message
app.post("/messages", (req, res) => {
    const { user, text } = req.body;
    if (!user || !text) {
        return res.status(400).json({ error: "User and message text are required" });
    }

    const newMessage = { user, text, timestamp: new Date().toISOString() };
    messages.push(newMessage);

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Chat server running at http://localhost:${PORT}`);
});