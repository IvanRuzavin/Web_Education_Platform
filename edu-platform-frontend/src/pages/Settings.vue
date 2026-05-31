<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const uid = localStorage.getItem("uid");
const router = useRouter();

const email = ref("");
const birthplace = ref("");
const phone = ref("");
const password = ref("");

onMounted(async () => {
  const res = await api.get(`/users/${uid}`);
  user.value = res.data;
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

<template>
  <div class="dashboard">

    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">

      <button
        class="sidebar-home"
        @click="router.push('/home')"
      >
        <i class="bi bi-house-fill"></i>
        <span>Home</span>
      </button>

      <button
        class="sidebar-icon"
        @click="router.push('/graph')"
      >
        <i class="bi bi-graph-up"></i>
      </button>

      <button
        class="sidebar-icon"
        @click="router.push('/settings')"
      >
        <i class="bi bi-gear-fill"></i>
      </button>

    </aside>

    <!-- RIGHT SIDE -->
    <div class="main-content">

      <!-- TOP NAVBAR -->
      <nav class="top-navbar" v-if="user">

        <div class="navbar-title">
          Embedded EDU Platform
        </div>

        <button
          class="user-navbar-btn"
          @click="router.push('/home')"
        >

          <img
            :src="user.avatar"
            class="navbar-avatar"
            :alt="user.login"
          >

          <span>
            {{ user.login }}
          </span>

        </button>

      </nav>

      <h2>Settings</h2>

      <input v-model="email" placeholder="Email" />
      <input v-model="birthplace" placeholder="Birthplace" />
      <input v-model="phone" placeholder="Phone" />
      <input v-model="password" placeholder="New password" type="password" />

      <button @click="save">Save</button>
    </div>
  </div>
</template>
