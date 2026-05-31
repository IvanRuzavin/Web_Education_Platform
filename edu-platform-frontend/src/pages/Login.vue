<template>
  <div class="login">
    <h2>Login</h2>

    <input v-model="uid" placeholder="UID" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="login">Login</button>

    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const uid = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

const login = async () => {
  try {
    const res = await api.post("/auth/login", {
      uid: uid.value,
      password: password.value
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("uid", uid.value);

    router.push("/home");
  } catch (e) {
    error.value = "Invalid credentials";
  }
};
</script>