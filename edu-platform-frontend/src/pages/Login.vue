<template>
  <div class="login-page">

    <div class="overlay"></div>

    <div class="login-card">

      <div class="login-header">
        <h1>Embedded EDU Platform</h1>
        <p>Sign in to continue</p>
      </div>

      <div class="mb-3">
        <label class="form-label">Login</label>
        <input
          v-model="uid"
          class="form-control"
          placeholder="Enter your login"
        />
      </div>

      <div class="mb-4">
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Enter your password"
          @keyup.enter="login"
        />
      </div>

      <button
        class="btn btn-primary w-100"
        @click="login"
      >
        <i class="bi bi-box-arrow-in-right me-2"></i>
        Login
      </button>

      <div
        v-if="error"
        class="alert alert-danger mt-3 mb-0"
      >
        {{ error }}
      </div>

    </div>

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

<style scoped>

.login-page {
  position: relative;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-image:
    url("https://www.electronicspecifier.com/wp-content/uploads/2025/12/Microchip_design.jpg");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(13, 17, 23, 0.85),
      rgba(13, 110, 253, 0.45)
    );
}

.login-card {
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 450px;

  padding: 40px;

  border-radius: 24px;

  background: rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  border: 1px solid rgba(255, 255, 255, 0.2);

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35);

  color: white;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.login-header p {
  margin: 0;
  opacity: 0.8;
}

.form-label {
  color: white;
  font-weight: 500;
}

.form-control {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.2);
  color: white;

  border-color: #0d6efd;

  box-shadow:
    0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.btn-primary {
  height: 48px;
  font-weight: 600;
  border-radius: 12px;
}

.alert {
  border-radius: 12px;
}

</style>