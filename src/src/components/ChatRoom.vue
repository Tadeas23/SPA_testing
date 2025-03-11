<script setup>
import { ref, onMounted } from "vue";

const props = defineProps(["user"]);
const emit = defineEmits(["logout"]);

const messages = ref([]);
const messageText = ref("");

let socket;

const connectWebSocket = () => {
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => console.log("✅ WebSocket připojen");
  socket.onmessage = (event) => {
    const msgData = JSON.parse(event.data);
    messages.value.push(msgData);
  };
  socket.onclose = () => setTimeout(connectWebSocket, 3000);
};

onMounted(connectWebSocket);

const sendMessage = () => {
  if (!messageText.value) return;
  socket.send(JSON.stringify({ user: props.user, text: messageText.value }));
  messageText.value = "";
};

const logout = () => {
  emit("logout");
};
</script>

<template>
  <div id="chat-section">
    <h3>Chat</h3>
    <button @click="logout">Odhlásit se</button>
    <div id="messages">
      <p v-for="msg in messages" :key="msg.text">
        <strong>{{ msg.user }}:</strong> {{ msg.text }}
      </p>
    </div>
    <input type="text" v-model="messageText" @keydown.enter="sendMessage" placeholder="Napiš zprávu..." />
    <button @click="sendMessage">Poslat</button>
  </div>
</template>
