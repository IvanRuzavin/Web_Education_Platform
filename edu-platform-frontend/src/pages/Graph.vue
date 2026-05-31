<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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

    <svg
        width="1200"
        height="800">

      <!-- center -->

      <circle
        cx="600"
        cy="400"
        r="80"
        fill="#198754"
      />

      <text
        x="575"
        y="410"
        fill="white">
        MCU
      </text>

      <!-- top -->

      <circle cx="600" cy="150" r="50"/>
      <text x="580" y="155">ADC</text>

      <line
        x1="600"
        y1="320"
        x2="600"
        y2="200"
        stroke="black"
      />

      <circle cx="450" cy="200" r="50"/>
      <text x="430" y="205">GPIO</text>

      <line
        x1="540"
        y1="340"
        x2="480"
        y2="240"
        stroke="black"
      />

      <circle cx="750" cy="200" r="50"/>
      <text x="730" y="205">UART</text>

      <line
        x1="660"
        y1="340"
        x2="720"
        y2="240"
        stroke="black"
      />

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

</style>

