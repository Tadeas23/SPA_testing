<script setup>
import { ref } from "vue";
import axios from "axios"; // Import axios
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import ChatRoom from "./components/ChatRoom.vue";

// Stav pro sledování aktuálního uživatele
const currentUser = ref(null);

// Funkce pro přihlášení uživatele
const handleLogin = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:3000/login", {
      username,
      password,
    });
    if (response.data.success) {
      // Pokud je přihlášení úspěšné, nastavíme uživatele
      currentUser.value = username;
    } else {
      console.error("Chyba při přihlášení:", response.data.error);
    }
  } catch (error) {
    console.error("Chyba při přihlášení", error);
  }
};

// Funkce pro registraci uživatele
const handleRegister = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:3000/register", {
      username,
      password,
    });
    if (response.data.success) {
      console.log("Registrace byla úspěšná");
      // Po úspěšné registraci, můžeme třeba automaticky přihlásit uživatele
      currentUser.value = username;
    }
  } catch (error) {
    console.error("Chyba při registraci", error);
  }
};

// Funkce pro odhlášení uživatele
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
      <RegisterForm @register="handleRegister" />
    </div>

    <!-- Pokud je uživatel přihlášený, zobrazí se chatovací místnost -->
    <ChatRoom v-if="currentUser" :user="currentUser" @logout="handleLogout" />
  </div>
</template>