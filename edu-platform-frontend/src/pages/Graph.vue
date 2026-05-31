<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const user = ref(null);
const uid = localStorage.getItem("uid");

onMounted(async () => {
  const res = await api.get(`/users/${uid}`);
  user.value = res.data;
});

const openSite = () => {
  window.open("https://www.mikroe.com/", "_blank");
};

const arm = [
  "ARM GPIO",
  "ARM ADC",
  "ARM PWM",
  "ARM UART",
  "ARM I2C",
  "ARM SPI"
];

const pic = [
  "PIC GPIO",
  "PIC ADC",
  "PIC PWM",
  "PIC UART",
  "PIC I2C",
  "PIC SPI"
];

const riscv = [
  "RISCV GPIO",
  "RISCV ADC",
  "RISCV PWM",
  "RISCV UART",
  "RISCV I2C",
  "RISCV SPI"
];

const pic32 = [
  "PIC32 GPIO",
  "PIC32 ADC",
  "PIC32 PWM",
  "PIC32 UART",
  "PIC32 I2C",
  "PIC32 SPI"
];

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
      <i class="bi bi-cpu"></i>
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

    <svg width="1200" height="800">

      <!-- CPU BODY -->
      <rect
        x="450"
        y="250"
        width="300"
        height="300"
        rx="20"
        fill="#212529"
        @click="openSite"
        style="cursor:pointer"
      />

      <text x="520" y="380" fill="white" font-size="24">
        MCU / CPU
      </text>

      <!-- TOP (ARM) -->
      <g v-for="(item, i) in arm" :key="item">
        <line
          :x1="420 + i * 80"
          y1="250"
          :x2="420 + i * 80"
          y2="200"
          stroke="black"
        />

        <rect
          :x="380 + i * 80"
          y="140"
          width="80"
          height="40"
          rx="8"
          fill="#e9f2ff"
          stroke="#0d6efd"
        />

        <text
          :x="420 + i * 80"
          y="160"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ item }}
        </text>
      </g>

      <!-- LEFT (PIC) -->
      <g v-for="(item, i) in pic" :key="item">
        <line
          x1="450"
          :y1="300 + i * 40"
          x2="350"
          :y2="300 + i * 40"
          stroke="black"
        />

        <rect
          x="220"
          :y="280 + i * 60"
          width="100"
          height="40"
          rx="8"
          fill="#eaf7ea"
          stroke="#198754"
        />

        <text
          x="230"
          :y="305 + i * 60"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ item }}
        </text>
      </g>

      <!-- RIGHT (RISCV) -->
      <g v-for="(item, i) in riscv" :key="item">
        <line
          x1="750"
          :y1="300 + i * 40"
          x2="850"
          :y2="300 + i * 40"
          stroke="black"
        />

        <rect
          x="880"
          :y="280 + i * 60"
          width="100"
          height="40"
          rx="8"
          fill="#f3eaff"
          stroke="#6f42c1"
        />

        <text
          x="860"
          :y="305 + i * 40"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ item }}
        </text>
      </g>

      <!-- BOTTOM (PIC32) -->
      <g v-for="(item, i) in pic32" :key="item">
        <line
          :x1="500 + i * 50"
          y1="550"
          :x2="500 + i * 50"
          y2="650"
          stroke="black"
        />

        <rect
          :x="380 + i * 80"
          y="680"
          width="80"
          height="40"
          rx="8"
          fill="#fff3e6"
          stroke="#fd7e14"
        />

        <text
          :x="470 + i * 50"
          y="680"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ item }}
        </text>
      </g>

    </svg>

  </div>
</div>

</template>

<style scoped>

.graph-page {
  width: 100%;
  overflow: auto;
  background: white;
}

circle {
  fill: #0d6efd;
}

text {
  fill: white;
  font-weight: bold;
}

.main-content {
  height: 100vh;
}

svg {
  display: block;
}

svg {
  width: 100%;
  height: 100%;
}

text {
  font-weight: bold;
}

line {
  stroke-width: 2;
}

</style>

