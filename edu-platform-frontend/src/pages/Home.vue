<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();

const projects = ref<any[]>([]);

const user = ref<any>(null);
const users = ref<any[]>([]);
const selectedUser = ref<any>(null);

const uid = localStorage.getItem("uid");

// progress animation
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

const loadProjects = async (uid: string) => {
  const res = await api.get(`/projects/${uid}`);
  projects.value = res.data;
};

// LOAD CURRENT USER
const loadUser = async () => {
  const res = await api.get(`/users/${uid}`);
  user.value = res.data;
  await api.put(`/users/${uid}`, {
    password: user.value.password,
    avatar: user.value.avatar,
    email: user.value.email,
    birthplace: user.value.birthplace,
    phone: user.value.phone,
    is_online: 1,
    status: user.value.status
  });
  selectedUser.value = res.data;
  animateProgress(res.data.progress);
  await loadProjects(user.value.uid);
};

// LOAD ALL USERS
const loadUsers = async () => {
  const res = await api.get(`/users`);
  users.value = res.data;
};

// CLICK USER CARD
const openUser = async (u: any) => {
  const res = await api.get(`/users/${u.uid}`);
  selectedUser.value = res.data;

  animateProgress(res.data.progress);

  await loadProjects(u.uid);
};

// LOGOUT
const logout = async () => {
  const u = user.value;

  await api.put(`/users/${uid}`, {
    password: u.password,
    name: u.name,
    surname: u.surname,
    progress: u.progress,
    experience: u.experience,
    level: u.level,
    rank: u.rank,
    avatar: u.avatar,
    email: u.email,
    birthplace: u.birthplace,
    phone: u.phone,
    is_online: 0,
    status: u.status
  });

  localStorage.removeItem("uid");
  router.push("/");
};

// COMPUTED → are we viewing self?
const isSelf = computed(() => {
  return selectedUser.value?.uid === user.value?.uid;
});

onMounted(async () => {
  await loadUser();

  window.addEventListener("beforeunload", () => {
    navigator.sendBeacon(
      `http://localhost:5000/users/${uid}`,
      new Blob([JSON.stringify({ is_online: 0 })], {
        type: "application/json"
      })
    );
  });

  await loadUsers();
});
</script>

<template>

<div class="dashboard">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <button class="sidebar-home" @click="router.push('/home')">
      <i class="bi bi-house-fill"></i>
      <span>Home</span>
    </button>

    <button class="sidebar-icon" @click="router.push('/graph')">
      <i class="bi bi-cpu"></i>
    </button>

    <button class="sidebar-icon" @click="router.push('/settings')">
      <i class="bi bi-gear-fill"></i>
    </button>
  </aside>

  <div class="main-content">

    <!-- NAVBAR -->
    <nav class="top-navbar" v-if="user">

      <div class="navbar-title">
        Embedded EDU Platform
      </div>

      <!-- USER DROPDOWN -->
      <div class="user-menu">
        <button class="user-navbar-btn">
          <img :src="user.avatar" class="navbar-avatar" />
          <span>{{ user.uid }}</span>
        </button>

        <div class="dropdown">
          <button class="dropdown-item" @click="logout">
            Logout
          </button>
        </div>
      </div>

    </nav>

    <!-- CONTENT -->
    <div class="container-fluid mt-4" v-if="selectedUser">

      <div class="row g-3">

        <!-- PROFILE -->
        <div class="col-lg-8">

          <div class="card shadow-sm profile-card h-100">

            <div class="card-body">

              <div class="row align-items-center">

                <div class="col-md-3 text-center">
                  <img :src="selectedUser.avatar" class="profile-avatar" />
                </div>

                <div class="col-md-9">

                  <h2 class="fw-bold">
                    {{ selectedUser.name }} {{ selectedUser.surname }}
                  </h2>

                  <p class="text-muted">{{ selectedUser.uid }}</p>

                  <div class="d-flex align-items-end gap-3 mb-3">

                    <div class="level-display">
                      {{ selectedUser.level }}
                    </div>

                    <div class="flex-grow-1">

                      <div class="d-flex justify-content-between">
                        <span>{{ animatedProgress }}%</span>
                      </div>

                      <div class="progress profile-progress">
                        <div
                          class="progress-bar"
                          :style="{ width: animatedProgress + '%' }"
                        ></div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div class="profile-stats">
              <div><strong>XP</strong><div>{{ selectedUser.experience }}</div></div>
              <div><strong>Rank</strong><div>{{ selectedUser.rank }}</div></div>
              <div>
                <strong>Projects</strong>
                <div v-if="projects.length === 0">
                  No projects yet
                </div>
                <div v-if="projects.length > 0">{{ projects.length }}</div>
              </div>
            </div>

          </div>

        </div>

        <!-- RIGHT -->
        <div class="col-lg-4">

          <button
            class="btn btn-primary w-100 mb-3"
            @click="router.push('/graph')"
          >
            Project Graph
          </button>

          <!-- ONLY IF SELF -->
          <button
            v-if="isSelf"
            class="btn btn-success w-100 mb-3"
            @click="router.push('/settings')"
          >
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
                  {{ selectedUser.email }}
                </li>

                <li class="list-group-item">
                  <i class="bi bi-telephone"></i>
                  {{ selectedUser.phone }}
                </li>

                <li class="list-group-item">
                  <i class="bi bi-geo-alt"></i>
                  {{ selectedUser.birthplace }}
                </li>

                <li class="list-group-item">
                  <i class="bi bi-person-workspace"></i>
                  {{ selectedUser.status }}
                </li>

              </ul>
            </div>


          </div>
          <div class="row g-3">

            <!-- USERS -->
            <div class="col-lg-6">
              <div class="card shadow-sm">

                <div class="card-header">
                  <h5>People Online</h5>
                </div>

                <div class="list-group">
                  <div
                    v-for="u in users"
                    :key="u.uid"
                    class="list-group-item user-card"
                    @click="openUser(u)"
                  >
                    <img :src="u.avatar" class="user-avatar" />
                    <span>{{ u.uid }}</span>
                    <span
                      class="status-dot"
                      :class="u.is_online ? 'online' : 'offline'"
                    ></span>
                  </div>
                </div>

              </div>
            </div>

            <!-- PROJECTS -->
            <div class="col-lg-6">
              <div class="card shadow-sm">

                <div class="card-header">
                  <h5>User Projects</h5>
                </div>

                <div class="list-group">

                  <div
                    v-for="p in projects"
                    :key="p.project_name"
                    class="list-group-item project-item"
                  >
                    <span>{{ p.project_name }}</span>

                    <span
                      class="project-score"
                      :class="p.score >= 85 ? 'good' : 'bad'"
                    >
                      {{ p.score }}
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>


        </div>

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

.user-menu {
  position: relative;
}

.dropdown {
  display: none;
  position: absolute;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-menu:hover .dropdown {
  display: block;
}

.dropdown-item {
  padding: 10px 20px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.online {
  background: #22c55e;
}

.offline {
  background: #9ca3af;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-score {
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 10px;
  color: white;
}

.good {
  background: #22c55e; /* green */
}

.bad {
  background: #ef4444; /* red */
}

</style>