<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

const emit = defineEmits(["login"]);

const loginUser = async () => {
  if (!username.value || !password.value) return alert("Zadej uživatelské jméno a heslo!");

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });
    if (!res.ok) throw new Error("Přihlášení selhalo");
    emit("login", username.value);
  } catch (error) {
    alert("Chyba: " + error.message);
  }
};
</script>

<template>
  <div id="login-section">
    <h3>Přihlášení</h3>
    <input type="text" v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="loginUser">Přihlásit</button>
  </div>
</template>
