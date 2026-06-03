<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../services/api";

const router = useRouter();
const route = useRoute();

const user = ref(null);
const myUid = localStorage.getItem("uid");
const graphUid = route.query.uid || myUid;

const projectScores = ref({});
const projectDetails = ref({});

onMounted(async () => {
  const meRes = await api.get(`/users/${myUid}`);
  user.value = meRes.data;

  const projectsRes = await api.get(`/projects/${graphUid}`);

  const scoreMap = {};
  const detailsMap = {};

  projectsRes.data.forEach(project => {
    scoreMap[project.project_id] = project.score;
    detailsMap[project.project_id] = project;
  });

  projectScores.value = scoreMap;
  projectDetails.value = detailsMap;
});

const openSite = () => {
  window.open("https://www.mikroe.com/", "_blank");
};

const scale = ref(0.8);
const pan = ref({ x: 200, y: 200 });
const isDragging = ref(false);
const wasDragging = ref(false);
const start = ref({ x: 0, y: 0 });

const onWheel = (e) => {
  e.preventDefault();
  scale.value += e.deltaY * -0.001;
  scale.value = Math.min(Math.max(0.5, scale.value), 2);
};

const startDrag = (e) => {
  isDragging.value = true;
  wasDragging.value = false;
  start.value = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y };
};

const onDrag = (e) => {
  if (!isDragging.value) return;

  wasDragging.value = true;
  pan.value = {
    x: e.clientX - start.value.x,
    y: e.clientY - start.value.y,
  };
};

const stopDrag = () => {
  isDragging.value = false;
  setTimeout(() => {
    wasDragging.value = false;
  }, 0);
};

const arm = ["ARM GPIO","ARM ADC","ARM PWM","ARM UART","ARM I2C","ARM SPI"];
const pic = ["PIC GPIO","PIC ADC","PIC PWM","PIC UART","PIC I2C","PIC SPI"];
const riscv = ["RISCV GPIO","RISCV ADC","RISCV PWM","RISCV UART","RISCV I2C","RISCV SPI"];
const pic32 = ["PIC32 GPIO","PIC32 ADC","PIC32 PWM","PIC32 UART","PIC32 I2C","PIC32 SPI"];

const Pins = [110, 165, 220, 275, 330, 385];

const normalizeProjectName = (label) =>
  label.toLowerCase().replaceAll(" ", "_");

const getProjectScore = (label) => {
  const key = normalizeProjectName(label);
  return projectScores.value[key];
};

const isProjectAvailable = (label) => {
  const key = normalizeProjectName(label);
  return projectDetails.value[key] !== undefined;
};

const openProject = (label) => {
  if (wasDragging.value || !isProjectAvailable(label)) return;

  router.push({
    path: `/projects/${normalizeProjectName(label)}`,
    query: { uid: graphUid }
  });
};

const getProjectColor = (label) => {
  const score = getProjectScore(label);

  if (score === undefined) {
    return "#6B7280";
  }

  if (score >= 85) {
    return "#16A34A";
  }

  if (score >= 50) {
    return "#EAB308";
  }

  return "#DC2626";
};
</script>

<template>
  <div class="dashboard">
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
      <nav class="top-navbar" v-if="user">
        <div>
          <div class="navbar-title">Embedded EDU Platform</div>
          <div class="graph-subtitle">
            Click an available colored project to open its project page. Gray projects are locked for this user.
          </div>
        </div>

        <button class="user-navbar-btn" @click="router.push('/home')">
          <img :src="user.avatar" class="navbar-avatar" :alt="user.uid" />
          <span>{{ user.uid }}</span>
        </button>
      </nav>

      <div class="graph-toolbar">
        <span class="legend available"></span> Available
        <span class="legend locked"></span> Locked
        <span class="legend good"></span> Excellent
        <span class="legend warning"></span> In progress
        <span class="legend danger"></span> Needs work
      </div>

      <svg
        viewBox="0 0 1600 1600"
        @wheel="onWheel"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <g :transform="`translate(${pan.x}, ${pan.y}) scale(${scale})`">
          <defs>
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

            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FDE047"/>
              <stop offset="50%" stop-color="#EAB308"/>
              <stop offset="100%" stop-color="#CA8A04"/>
            </linearGradient>

            <linearGradient id="chipBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#374151"/>
              <stop offset="50%" stop-color="#1F2937"/>
              <stop offset="100%" stop-color="#111827"/>
            </linearGradient>

            <linearGradient id="substrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#475569"/>
              <stop offset="100%" stop-color="#1E293B"/>
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect x="32" y="32" width="448" height="448" rx="32" fill="url(#substrateGrad)" stroke="#64748B" stroke-width="4"/>

          <g fill="url(#goldGrad)">
            <rect x="44" y="44" width="40" height="40" rx="4"/>
            <rect x="428" y="44" width="40" height="40" rx="4"/>
            <rect x="44" y="428" width="40" height="40" rx="4"/>
            <rect x="428" y="428" width="40" height="40" rx="4"/>
          </g>

          <g opacity="0.15">
            <rect x="70" y="-250" width="360" height="250" rx="12" fill="#38BDF8" />
            <text x="250" y="-200" font-size="60" font-weight="bold" fill="#FFFFFF" text-anchor="middle">ARM</text>
          </g>

          <g opacity="0.15">
            <rect x="70" y="500" width="360" height="280" rx="12" fill="#38BDF8" />
            <text x="250" y="770" font-size="60" font-weight="bold" fill="#FFFFFF" text-anchor="middle">PIC32</text>
          </g>

          <g opacity="0.15">
            <rect x="-200" y="20" width="200" height="400" rx="12" fill="#38BDF8" />
            <text x="-100" y="80" font-size="60" font-weight="bold" fill="#FFFFFF" text-anchor="middle">PIC</text>
          </g>

          <g opacity="0.15">
            <rect x="510" y="20" width="200" height="400" rx="12" fill="#38BDF8" />
            <text x="610" y="80" font-size="60" font-weight="bold" fill="#FFFFFF" text-anchor="middle">RISCV</text>
          </g>

          <g stroke="#475569" stroke-width="2">
            <g
              v-for="(label, index) in arm"
              :key="'top-'+index"
              class="project-node"
              :class="{ locked: !isProjectAvailable(label) }"
              @click.stop="openProject(label)"
            >
              <rect :x="Pins[index]" y="-10" width="16" height="50" fill="url(#pinGradH)" />
              <rect :x="Pins[index] - 15" y="-190" width="40" height="180" rx="3" :fill="getProjectColor(label)" stroke="#38BDF8" />
              <text :x="Pins[index]" y="-90" font-size="40" font-weight="300" font-family="Arial, sans-serif" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" :transform="`rotate(-90 ${Pins[index]} -100)`">
                {{ label.split(' ')[1] }} {{ getProjectScore(label) ?? '--' }}
              </text>
            </g>

            <g
              v-for="(label, index) in pic32"
              :key="'bottom-'+index"
              class="project-node"
              :class="{ locked: !isProjectAvailable(label) }"
              @click.stop="openProject(label)"
            >
              <rect :x="Pins[index]" y="468" width="16" height="50" fill="url(#pinGradH)" />
              <rect :x="Pins[index] - 15" y="520" width="40" height="180" rx="3" :fill="getProjectColor(label)" stroke="#38BDF8" />
              <text :x="Pins[index]" y="610" font-size="40" font-weight="300" font-family="Arial, sans-serif" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" :transform="`rotate(90 ${Pins[index]} 610)`">
                {{ label.split(' ')[1] }} {{ getProjectScore(label) ?? '--' }}
              </text>
            </g>

            <g
              v-for="(label, index) in pic"
              :key="'left-'+index"
              class="project-node"
              :class="{ locked: !isProjectAvailable(label) }"
              @click.stop="openProject(label)"
            >
              <rect x="-10" :y="Pins[index] - 3" width="55" height="16" fill="url(#pinGradV)" />
              <rect x="-190" :y="Pins[index] - 15" width="180" height="40" rx="3" :fill="getProjectColor(label)" stroke="#38BDF8" />
              <text x="-100" :y="Pins[index] + 8" font-size="40" font-weight="300" font-family="Arial, sans-serif" fill="#FFFFFF" style="fill:#FFFFFF" text-anchor="middle" dominant-baseline="middle">
                {{ label.split(' ')[1] }} {{ getProjectScore(label) ?? '--' }}
              </text>
            </g>

            <g
              v-for="(label, index) in riscv"
              :key="'right-'+index"
              class="project-node"
              :class="{ locked: !isProjectAvailable(label) }"
              @click.stop="openProject(label)"
            >
              <rect x="465" :y="Pins[index] - 3" width="55" height="16" fill="url(#pinGradV)" />
              <rect x="520" :y="Pins[index] - 15" width="180" height="40" rx="3" :fill="getProjectColor(label)" stroke="#38BDF8" />
              <text x="600" :y="Pins[index] + 8" font-size="40" font-weight="300" font-family="Arial, sans-serif" fill="#FFFFFF" style="fill:#FFFFFF" text-anchor="middle" dominant-baseline="middle">
                {{ label.split(' ')[1] }} {{ getProjectScore(label) ?? '--' }}
              </text>
            </g>
          </g>

          <rect x="96" y="96" width="320" height="320" rx="16" fill="url(#chipBody)" stroke="#475569" stroke-width="4"/>

          <g fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" filter="url(#glow)">
            <path d="M 120 256 H 220 L 256 220 L 290 256 H 392"/>
            <path d="M 160 120 V 190 L 200 230 L 256 200 L 312 230 L 352 190 V 120"/>
            <path d="M 160 392 V 322 L 200 282 L 256 312 L 312 282 L 352 322 V 392"/>
            <path d="M 256 120 V 160 M 256 392 V 360"/>
            <circle cx="256" cy="256" r="36" stroke="#0EA5E9" stroke-width="4"/>
            <circle cx="256" cy="256" r="16" fill="#38BDF8"/>
          </g>

          <rect x="176" y="226" width="160" height="60" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="2"/>
          <text x="256" y="264" font-family="monospace" font-weight="bold" font-size="24" fill="#38BDF8" text-anchor="middle" letter-spacing="4" @click="openSite" style="cursor:pointer">MIKROE</text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  background: radial-gradient(circle at top, #123b68 0, #0e2342 45%, #0b172a 100%);
  min-height: 100vh;
}

.graph-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 2px;
}

.graph-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 16px 24px 0;
  padding: 12px 16px;
  border-radius: 16px;
  color: white;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(12px);
  width: fit-content;
}

.legend {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  margin-right: -8px;
}

.legend.available {
  background: #16a34a;
}

.legend.locked {
  background: #6b7280;
}

.legend.good {
  background: #16a34a;
}

.legend.warning {
  background: #eab308;
}

.legend.danger {
  background: #dc2626;
}

svg {
  width: 100%;
  height: calc(100vh - 140px);
  user-select: none;
}

.project-node {
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.project-node:hover {
  opacity: 0.9;
}

.project-node.locked {
  cursor: not-allowed;
  opacity: 0.42;
}
</style>
