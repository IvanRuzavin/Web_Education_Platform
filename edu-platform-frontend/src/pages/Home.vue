<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const user = ref(null);
const router = useRouter();

const uid = localStorage.getItem("uid");

const loadUser = async () => {
  const res = await api.get(`/users/${uid}`);
  user.value = res.data;
};

const goGraph = () => router.push("/graph");
const goSettings = () => router.push("/settings");

onMounted(loadUser);
</script>

<template>

<div class="hero">

  <div class="profile-card" v-if="user">


    <img
      :src=user.avatar
      class="avatar"
    >
    <div v-if="user">

      <h1>
        {{ user.name }} {{ user.surname }}
      </h1>

      <h5>
        {{ user.login }}
      </h5>

      <h3>
        Level {{ user.level }}
      </h3>

      <div class="progress mt-3">

        <div
          class="progress-bar"
          :style="{width: user.progress + '%'}"
        >
          {{ user.progress }}%
        </div>

      </div>

    </div>

  </div>

</div>

<div class="container mt-4">

  <div class="row">

    <div class="col-md-4">

      <div class="card stat-card" v-if="user">

        <h2>
          {{ user.experience }}
        </h2>

        <p>XP</p>

      </div>

    </div>

    <div class="col-md-4">

      <div class="card stat-card" v-if="user">

        <h2>
          {{ user.rank }}
        </h2>

        <p>Rank</p>

      </div>

    </div>

    <div class="col-md-4">

      <div class="card stat-card">

        <h2>
          12
        </h2>

        <p>Projects</p>

      </div>

    </div>

  </div>

</div>

<div class="container mt-4">

  <div class="row">

    <div class="col-md-6">

      <button class="btn btn-primary w-100" @click="goGraph">
        Project Graph
      </button>

    </div>

    <div class="col-md-6">

      <button class="btn btn-success w-100" @click="goSettings">
        Update Profile
      </button>

    </div>

  </div>

</div>

<div class="container mt-4">

  <div class="card p-4" v-if="user">

    <h4>Personal Information</h4>

    <hr>

    <p>Email: {{ user.email }}</p>

    <p>Born in {{ user.birthplace }}</p>

    <p>Role: Embedded Developer</p>

  </div>

</div>

</template>

<style scoped>

.hero {
  background: #20232a;
  padding: 50px;
  color: white;
}

.profile-card {
  display: flex;
  gap: 30px;
  align-items: center;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

</style>
