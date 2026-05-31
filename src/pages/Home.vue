<script setup lang="ts">

const profile = {
  fullName: 'Ivan Ruzavin',
  login: 'iruzavin',
  level: 6,
  progress: 75,
  experience: 4500,
  rank: 3,
  avatar:
    'https://avatars.githubusercontent.com/u/583231?v=4'
}

</script>

<template>

<div class="hero">

  <div class="profile-card">

    <img
      :src="profile.avatar"
      class="avatar"
    >

    <div>

      <h1>
        {{ profile.fullName }}
      </h1>

      <h5>
        {{ profile.login }}
      </h5>

      <h3>
        Level {{ profile.level }}
      </h3>

      <div class="progress mt-3">

        <div
          class="progress-bar"
          :style="{width: profile.progress + '%'}"
        >
          {{ profile.progress }}%
        </div>

      </div>

    </div>

  </div>

</div>

<div class="container mt-4">

  <div class="row">

    <div class="col-md-4">

      <div class="card stat-card">

        <h2>
          {{ profile.experience }}
        </h2>

        <p>XP</p>

      </div>

    </div>

    <div class="col-md-4">

      <div class="card stat-card">

        <h2>
          {{ profile.rank }}
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

      <button class="btn btn-primary w-100">
        Project Graph
      </button>

    </div>

    <div class="col-md-6">

      <button class="btn btn-success w-100">
        Update Profile
      </button>

    </div>

  </div>

</div>

<div class="container mt-4">

  <div class="card p-4">

    <h4>Personal Information</h4>

    <hr>

    <p>Email: ivan@example.com</p>

    <p>Location: Belgrade</p>

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