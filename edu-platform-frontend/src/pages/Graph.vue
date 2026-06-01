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

// ZOOM + PAN
const scale = ref(0.8);
const pan = ref({ x: 200, y: 200 });
const isDragging = ref(false);
const start = ref({ x: 0, y: 0 });

const onWheel = (e) => {
  e.preventDefault();
  scale.value += e.deltaY * -0.001;
  scale.value = Math.min(Math.max(0.5, scale.value), 2);
};

const startDrag = (e) => {
  isDragging.value = true;
  start.value = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y };
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  pan.value = {
    x: e.clientX - start.value.x,
    y: e.clientY - start.value.y,
  };
};

const stopDrag = () => (isDragging.value = false);

// NAVIGATION
const goToNode = (label) => {
  const route = "/" + label.toLowerCase().replaceAll(" ", "_");
  router.push(route);
};

// DATA
const arm = ["ARM GPIO","ARM ADC","ARM PWM","ARM UART","ARM I2C","ARM SPI"];
const pic = ["PIC GPIO","PIC ADC","PIC PWM","PIC UART","PIC I2C","PIC SPI"];
const riscv = ["RISCV GPIO","RISCV ADC","RISCV PWM","RISCV UART","RISCV I2C","RISCV SPI"];
const pic32 = ["PIC32 GPIO","PIC32 ADC","PIC32 PWM","PIC32 UART","PIC32 I2C","PIC32 SPI"];

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

      <svg
        viewBox="0 0 800 800"
        @wheel="onWheel"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <g :transform="`translate(${pan.x}, ${pan.y}) scale(${scale})`">
        <defs>
          <!-- Metallic gradients for pins -->
          <linearGradient id="pinGradH" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#D1D5DB"/>
            <stop offset="50%" stop-color="#9CA3AF"/>
            <stop offset="100%" stop-color="#4B5563"/>
          </linearGradient>
          <linearGradient id="pinGradV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#D1D5DB"/>
            <stop offset="50%" stop-color="#9CA3AF"/>
            <stop offset="100%" stop-color="#4B5563"/>
          </linearGradient>

          <!-- Gold gradient for chip pads -->
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="50%" stop-color="#EAB308"/>
            <stop offset="100%" stop-color="#CA8A04"/>
          </linearGradient>

          <!-- Center chip body gradient -->
          <linearGradient id="chipBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#374151"/>
            <stop offset="50%" stop-color="#1F2937"/>
            <stop offset="100%" stop-color="#111827"/>
          </linearGradient>

          <!-- Substrate/Base Gradient -->
          <linearGradient id="substrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#1E293B"/>
          </linearGradient>

          <!-- Glow effect for circuit traces -->
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Outer Substrate Layer -->
        <rect x="32" y="32" width="448" height="448" rx="32" fill="url(#substrateGrad)" stroke="#64748B" stroke-width="4"/>

        <!-- Gold Contact Pads (Corner Pins) -->
        <g fill="url(#goldGrad)">
          <rect x="44" y="44" width="40" height="40" rx="4"/>
          <rect x="428" y="44" width="40" height="40" rx="4"/>
          <rect x="44" y="428" width="40" height="40" rx="4"/>
          <rect x="428" y="428" width="40" height="40" rx="4"/>
        </g>

        <!-- Array of Pins -->
        <g stroke="#475569" stroke-width="2">
          <!-- Top and Bottom Rows -->
          <rect x="100" y="24" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="140" y="24" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="180" y="24" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="220" y="24" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="260" y="24" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="300" y="24" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="340" y="24" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="380" y="24" width="16" height="20" fill="url(#pinGradH)"/>

          <rect x="100" y="468" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="140" y="468" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="180" y="468" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="220" y="468" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="260" y="468" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="300" y="468" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="340" y="468" width="16" height="20" fill="url(#pinGradH)"/>
          <rect x="380" y="468" width="16" height="20" fill="url(#pinGradH)"/>

          <!-- Left and Right Rows -->
          <rect x="24" y="100" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="24" y="140" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="24" y="180" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="24" y="220" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="24" y="260" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="24" y="300" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="24" y="340" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="24" y="380" width="20" height="16" fill="url(#pinGradV)"/>

          <rect x="468" y="100" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="468" y="140" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="468" y="180" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="468" y="220" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="468" y="260" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="468" y="300" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="468" y="340" width="20" height="16" fill="url(#pinGradV)"/>
          <rect x="468" y="380" width="20" height="16" fill="url(#pinGradV)"/>
        </g>

        <!-- Inner Heat Spreader (Die/Lid) -->
        <rect x="96" y="96" width="320" height="320" rx="16" fill="url(#chipBody)" stroke="#475569" stroke-width="4"/>

        <!-- Silicon Chip Circuit Traces & Glow -->
        <g fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" filter="url(#glow)">
          <path d="M 120 256 H 220 L 256 220 L 290 256 H 392"/>
          <path d="M 160 120 V 190 L 200 230 L 256 200 L 312 230 L 352 190 V 120"/>
          <path d="M 160 392 V 322 L 200 282 L 256 312 L 312 282 L 352 322 V 392"/>
          <path d="M 256 120 V 160 M 256 392 V 360"/>
          <circle cx="256" cy="256" r="36" stroke="#0EA5E9" stroke-width="4"/>
          <circle cx="256" cy="256" r="16" fill="#38BDF8"/>
        </g>

        <!-- Internal Processor Label/Plate -->
        <rect x="176" y="226" width="160" height="60" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="2"/>
        <text x="256" y="264" font-family="monospace" font-weight="bold" font-size="24" fill="#38BDF8" text-anchor="middle" letter-spacing="4" @click="openSite" style="cursor:pointer">MIKROE</text>

        <!-- First Orientation Marker (Triangle Notch) -->
        <polygon points="120,96 140,96 120,116" fill="#9CA3AF"/>
        </g>
      </svg>

  </div>

</div>

</template>
