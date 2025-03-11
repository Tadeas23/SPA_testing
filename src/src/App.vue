<script setup>
import { ref } from "vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import ChatRoom from "./components/ChatRoom.vue";

// Stav pro sledování aktuálního uživatele
const currentUser = ref(null);

const handleLogin = (username) => {
  currentUser.value = username;
};
const handleLogout = () => {
  currentUser.value = null;
};
</script>

<template>
  <div>
    <h2>Chat Aplikace</h2>

    <!-- Pokud uživatel není přihlášený, zobrazí se login a registrace -->
    <div v-if="!currentUser">
      <LoginForm @login="handleLogin" />
      <RegisterForm />
    </div>

    <!-- Pokud je uživatel přihlášený, zobrazí se chatovací místnost -->
    <ChatRoom v-if="currentUser" :user="currentUser" @logout="handleLogout" />
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #007bff;
}
</style>