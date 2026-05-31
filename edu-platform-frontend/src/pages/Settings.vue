<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const avatarStock = [

  "https://i.pravatar.cc/300?img=1",
  "https://i.pravatar.cc/300?img=2",
  "https://i.pravatar.cc/300?img=3",
  "https://i.pravatar.cc/300?img=4",
  "https://i.pravatar.cc/300?img=5",
  "https://i.pravatar.cc/300?img=6"

];

const uid = localStorage.getItem("uid");
const router = useRouter();

const user = ref(null);

const uidValue = ref("");
const name = ref("");
const surname = ref("");
const avatar = ref("");

const email = ref("");
const birthplace = ref("");
const phone = ref("");
const password = ref("");

onMounted(async () => {
  const res = await api.get(`/users/${uid}`);

  user.value = res.data;

  uidValue.value = res.data.uid;
  name.value = res.data.name;
  surname.value = res.data.surname;

  avatar.value = res.data.avatar;

  email.value = res.data.email;
  birthplace.value = res.data.birthplace;
  phone.value = res.data.phone;
});

const save = async () => {

  await api.put(`/users/${uid}`, {

    uid: uidValue.value,
    password: password.value,

    name: name.value,
    surname: surname.value,

    avatar: avatar.value,

    email: email.value,
    birthplace: birthplace.value,
    phone: phone.value

  });

  alert("Profile updated");
};

const selectAvatar = (url: string) => {
  avatar.value = url;
};
</script>

<template>
  <div class="dashboard-settings">

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

      <!-- Preview -->
      <div class="card shadow-sm mb-4">

        <div class="card-body">

          <div class="d-flex align-items-center gap-4">

            <img
              :src="avatar"
              class="preview-avatar"
            >

            <div>

              <h3>
                {{ name }} {{ surname }}
              </h3>

              <p class="text-muted mb-0">
                {{ uidValue }}
              </p>

            </div>

          </div>

        </div>

      </div>

      <div class="row g-4">

        <!-- Account -->

        <div class="col-lg-6">

          <div class="card shadow-sm">

            <div class="card-header">
              <h5 class="mb-0">
                Account
              </h5>
            </div>

            <div class="card-body">

              <div class="mb-3">
                <label class="form-label">UID</label>
                <input
                  class="form-control"
                  v-model="uidValue"
                >
              </div>

              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  class="form-control"
                  v-model="name"
                >
              </div>

              <div class="mb-3">
                <label class="form-label">Surname</label>
                <input
                  class="form-control"
                  v-model="surname"
                >
              </div>

              <div class="mb-3">
                <label class="form-label">
                  New Password
                </label>

                <input
                  type="password"
                  class="form-control"
                  v-model="password"
                >
              </div>

            </div>

          </div>

        </div>

        <!-- Avatar -->

        <div class="col-lg-6">

          <div class="card shadow-sm">

            <div class="card-header">
              <h5 class="mb-0">
                Avatar
              </h5>
            </div>

            <div class="card-body">

              <div class="mb-3">

                <label class="form-label">
                  Avatar URL
                </label>

                <input
                  class="form-control"
                  v-model="avatar"
                >

              </div>

              <div class="avatar-grid">

                <img
                  v-for="a in avatarStock"
                  :key="a"
                  :src="a"
                  class="avatar-option"
                  :class="{ selected: avatar === a }"
                  @click="selectAvatar(a)"
                >

              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- Personal -->

      <div class="card shadow-sm mt-4">

        <div class="card-header">
          <h5 class="mb-0">
            Personal Information
          </h5>
        </div>

        <div class="card-body">

          <div class="row">

            <div class="col-md-4">

              <label class="form-label">
                Email
              </label>

              <input
                class="form-control"
                v-model="email"
              >

            </div>

            <div class="col-md-4">

              <label class="form-label">
                Phone
              </label>

              <input
                class="form-control"
                v-model="phone"
              >

            </div>

            <div class="col-md-4">

              <label class="form-label">
                Birthplace
              </label>

              <input
                class="form-control"
                v-model="birthplace"
              >

            </div>

          </div>

        </div>

      </div>

      <div class="mt-4 text-end">

        <button
          class="btn btn-success btn-lg"
          @click="save"
        >
          <i class="bi bi-floppy"></i>
          Save Changes
        </button>

      </div>

    </div>
  </div>
</template>

<style scope>
.preview-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 3px solid transparent;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: #0d6efd;
}

.dashboard-settings {
  position: relative;
  min-height: 100vh;

  display: flex;

  background-image:
    url("https://www.electronicspecifier.com/wp-content/uploads/2025/12/Microchip_design.jpg");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow: hidden;
}

</style>