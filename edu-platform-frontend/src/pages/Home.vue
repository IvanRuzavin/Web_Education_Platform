<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const user = ref(null);
const router = useRouter();

const uid = localStorage.getItem("uid");

const animatedProgress = ref(0);

const animateProgress = (target: number) => {

  animatedProgress.value = 0;

  const interval = setInterval(() => {

    if (animatedProgress.value >= target) {
      clearInterval(interval);
      return;
    }

    animatedProgress.value++;

  }, 15);
};

const loadUser = async () => {

  const res = await api.get(`/users/${uid}`);

  user.value = res.data;

  animateProgress(res.data.progress);
};

onMounted(loadUser);
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
            :alt="user.uid"
          >

          <span>
            {{ user.uid }}
          </span>

        </button>

      </nav>

      <!-- PAGE CONTENT -->
      <div class="container-fluid mt-4" v-if="user">

        <div class="row g-3 align-items-stretch">

          <!-- LEFT -->
          <div class="col-lg-8">

            <div class="card shadow-sm profile-card  h-100">

              <div class="card-body">

                <div class="row align-items-center">

                  <!-- Avatar -->
                  <div class="col-md-3 text-center">

                    <img
                      :src="user.avatar"
                      :alt="user.name"
                      class="profile-avatar"
                    >

                  </div>

                  <!-- Main Profile Data -->
                  <div class="col-md-9">

                    <h2 class="fw-bold mb-1">
                      {{ user.name }} {{ user.surname }}
                    </h2>

                    <p class="text-muted mb-4">
                      {{ user.uid }}
                    </p>

                    <!-- Level + Progress -->
                    <div class="d-flex align-items-end gap-3 mb-3">

                      <div class="level-display">
                        {{ user.level }}
                      </div>

                      <div class="flex-grow-1">

                        <div class="d-flex justify-content-between mb-1">

                          <span>
                            {{ animatedProgress }}%
                          </span>

                          <span>
                            Embedded Developer
                          </span>

                        </div>

                        <div class="progress profile-progress">

                          <div
                            class="progress-bar"
                            role="progressbar"
                            :style="{ width: animatedProgress + '%' }"
                          >
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <!-- Bottom Stats -->
              <div class="profile-stats">

                <div>
                  <strong>XP</strong>
                  <div>{{ user.experience }}</div>
                </div>

                <div>
                  <strong>Rank</strong>
                  <div>{{ user.rank }}</div>
                </div>

                <div>
                  <strong>Projects</strong>
                  <div>12</div>
                </div>

              </div>

            </div>

          </div>

          <!-- RIGHT COLUMN -->
          <div class="col-lg-4">

            <!-- GRAPH BUTTON -->
            <button
              class="btn btn-primary w-100 mb-3"
              @click="router.push('/graph')"
            >
              <i class="bi bi-graph-up"></i>
              Project Graph
            </button>

            <!-- SETTINGS BUTTON -->
            <button
              class="btn btn-success w-100 mb-3"
              @click="router.push('/settings')"
            >
              <i class="bi bi-pencil-square"></i>
              Update Profile
            </button>

            <!-- PERSONAL INFO -->
            <div class="card shadow-sm  h-80">

              <div class="card-header">
                <h5 class="mb-0">
                  Personal Information
                </h5>
              </div>

              <ul class="list-group list-group-flush">

                <li class="list-group-item">
                  <i class="bi bi-envelope"></i>
                  {{ user.email }}
                </li>

                <li class="list-group-item">
                  <i class="bi bi-telephone"></i>
                  {{ user.phone }}
                </li>

                <li class="list-group-item">
                  <i class="bi bi-geo-alt"></i>
                  {{ user.birthplace }}
                </li>

                <li class="list-group-item">
                  <i class="bi bi-person-workspace"></i>
                  Embedded Developer
                </li>

              </ul>

            </div>

          </div>

        </div>

      </div>

      <!-- LOADING -->
      <div
        v-else
        class="text-center mt-5"
      >

        <div class="spinner-border"></div>

        <h5 class="mt-3">
          Loading profile...
        </h5>

      </div>

    </div>

  </div>

</template>

<style scoped>

.progress {
  height: 25px;
}

.profile-card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #0d6efd;
}

.level-display {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  min-width: 80px;
}

.profile-progress {
  height: 12px;
  border-radius: 10px;
}

.profile-progress .progress-bar {
  transition: width 0.15s ease;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
}

.profile-stats div {
  text-align: center;
}

.profile-stats strong {
  display: block;
  margin-bottom: 4px;
}

</style>