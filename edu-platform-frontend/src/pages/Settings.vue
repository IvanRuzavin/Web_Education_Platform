<template>
  <div>
    <h2>Settings</h2>

    <input v-model="email" placeholder="Email" />
    <input v-model="birthplace" placeholder="Birthplace" />
    <input v-model="phone" placeholder="Phone" />
    <input v-model="password" placeholder="New password" type="password" />

    <button @click="save">Save</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const uid = localStorage.getItem("uid");

const email = ref("");
const birthplace = ref("");
const phone = ref("");
const password = ref("");

onMounted(async () => {
  const res = await api.get(`/users/${uid}`);
  email.value = res.data.email;
  birthplace.value = res.data.birthplace;
  phone.value = res.data.phone;
});

const save = async () => {
  await api.put(`/users/${uid}`, {
    email: email.value,
    birthplace: birthplace.value,
    phone: phone.value,
    password: password.value
  });

  alert("Updated!");
};
</script>