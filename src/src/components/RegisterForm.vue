<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

const registerUser = async () => {
  if (!username.value || !password.value) return alert("Vyplň jméno a heslo!");

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });
    if (!res.ok) throw new Error("Registrace selhala");
    alert("Registrace úspěšná!");
  } catch (error) {
    alert("Chyba: " + error.message);
  }
};
</script>

<template>
  <div id="registration-section">
    <h3>Registrace</h3>
    <input type="text" v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="registerUser">Registrovat</button>
  </div>
</template>
