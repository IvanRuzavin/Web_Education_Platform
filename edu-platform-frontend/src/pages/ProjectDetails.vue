<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";

const route = useRoute();
const router = useRouter();

const myUid = localStorage.getItem("uid");
const projectId = route.params.projectId as string;
const ownerUid = (route.query.uid as string) || myUid;

const user = ref<any>(null);
const owner = ref<any>(null);
const project = ref<any>(null);
const evaluationSummary = ref<any>(null);
const loading = ref(true);
const actionMessage = ref("");
const actionError = ref("");

const isOwner = computed(() => ownerUid === myUid);
const completedEvaluations = computed(() => evaluationSummary.value?.completed || project.value?.completed_evaluations || 0);
const pendingEvaluations = computed(() => evaluationSummary.value?.pending || project.value?.pending_evaluations || 0);
const totalBookedEvaluations = computed(() => completedEvaluations.value + pendingEvaluations.value);
const requiredEvaluations = computed(() => evaluationSummary.value?.required || 2);

const canBookEvaluation = computed(() => {
  return Boolean(
    isOwner.value &&
    project.value?.is_available &&
    user.value?.evaluation_points > 0 &&
    totalBookedEvaluations.value < requiredEvaluations.value
  );
});

const bookButtonText = computed(() => {
  if (!project.value?.is_available) return "Project is locked";
  if (!isOwner.value) return "Only the project owner can book evaluation";
  if (user.value?.evaluation_points <= 0) return "Not enough EVP";
  if (totalBookedEvaluations.value >= requiredEvaluations.value) return "Required evaluations booked";
  return "Book evaluation";
});

const loadProject = async () => {
  loading.value = true;

  const [meRes, ownerRes, projectRes, summaryRes] = await Promise.all([
    api.get(`/users/${myUid}`),
    api.get(`/users/${ownerUid}`),
    api.get(`/projects/project/${projectId}`, { params: { uid: ownerUid } }),
    api.get(`/evaluations/project/${projectId}/${ownerUid}`)
  ]);

  user.value = meRes.data;
  owner.value = ownerRes.data;
  project.value = projectRes.data;
  evaluationSummary.value = summaryRes.data;
  loading.value = false;
};

const bookEvaluation = async () => {
  actionMessage.value = "";
  actionError.value = "";

  try {
    const res = await api.post("/evaluations/book", {
      project_id: projectId,
      evaluated_user_id: ownerUid
    });

    actionMessage.value = `Evaluation booked. ${res.data.evaluator.name} ${res.data.evaluator.surname} was notified on their home page.`;
    await loadProject();
  } catch (error: any) {
    actionError.value = error.response?.data?.error || "Unable to book evaluation.";
  }
};

const openPdf = () => {
  if (!project.value?.pdf_url) return;
  window.open(project.value.pdf_url, "_blank");
};

onMounted(loadProject);
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

    <div class="main-content project-page">
      <nav class="top-navbar" v-if="user">
        <div>
          <div class="navbar-title">Embedded EDU Platform</div>
          <div class="project-breadcrumb">
            Project defense · {{ owner?.uid }}
          </div>
        </div>

        <button class="user-navbar-btn" @click="router.push('/home')">
          <img :src="user.avatar" class="navbar-avatar" :alt="user.uid" />
          <span>{{ user.uid }}</span>
        </button>
      </nav>

      <div class="container-fluid py-4" v-if="!loading && project">
        <div v-if="actionMessage" class="alert alert-success">
          {{ actionMessage }}
        </div>

        <div v-if="actionError" class="alert alert-danger">
          {{ actionError }}
        </div>

        <div class="project-hero">
          <img :src="project.image_url" class="project-image" :alt="project.project_name" />

          <div class="project-hero-content">
            <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
              <span class="badge text-bg-primary">{{ project.peripheral }}</span>
              <span class="badge text-bg-secondary">Complexity {{ project.complexity }}</span>
              <span
                class="badge"
                :class="project.is_available ? 'text-bg-success' : 'text-bg-dark'"
              >
                {{ project.is_available ? 'Available' : 'Locked' }}
              </span>
            </div>

            <h1>{{ project.project_name }}</h1>
            <p>{{ project.description }}</p>

            <div class="project-actions">
              <button class="btn btn-light btn-lg" @click="openPdf">
                <i class="bi bi-file-earmark-pdf"></i>
                Download PDF
              </button>

              <button
                class="btn btn-warning btn-lg"
                :disabled="!canBookEvaluation"
                @click="bookEvaluation"
              >
                <i class="bi bi-calendar-check"></i>
                {{ bookButtonText }}
              </button>
            </div>
          </div>
        </div>

        <div class="row g-4 mt-1">
          <div class="col-lg-4">
            <div class="metric-card">
              <span>Current score</span>
              <strong>{{ project.score ?? '--' }}</strong>
              <small>Score is recalculated from completed evaluations.</small>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="metric-card">
              <span>Evaluations</span>
              <strong>{{ completedEvaluations }} / {{ requiredEvaluations }}</strong>
              <small v-if="pendingEvaluations">{{ pendingEvaluations }} pending evaluation request(s).</small>
              <small v-else>No pending evaluation requests.</small>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="metric-card">
              <span>Your EVP</span>
              <strong>{{ user.evaluation_points }} / 3</strong>
              <small>Booking an evaluation costs 1 EVP.</small>
            </div>
          </div>
        </div>

        <div class="row g-4 mt-1">
          <div class="col-lg-7">
            <div class="card shadow-sm h-100">
              <div class="card-header">
                <h5 class="mb-0">Project Content</h5>
              </div>

              <div class="card-body">
                <h6>Learning goals</h6>
                <ul class="project-list">
                  <li v-for="goal in project.learning_goals" :key="goal">
                    {{ goal }}
                  </li>
                </ul>

                <h6 class="mt-4">Defense requirements</h6>
                <ul class="project-list">
                  <li v-for="requirement in project.requirements" :key="requirement">
                    {{ requirement }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card shadow-sm h-100">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Evaluation History</h5>
                <span class="badge text-bg-primary">{{ evaluationSummary.evaluations.length }}</span>
              </div>

              <div class="card-body" v-if="evaluationSummary.evaluations.length === 0">
                <p class="text-muted mb-0">
                  There are no evaluations for this project yet.
                </p>
              </div>

              <div class="history-list" v-else>
                <div
                  v-for="evaluation in evaluationSummary.evaluations"
                  :key="evaluation.evaluation_id"
                  class="history-item"
                >
                  <img :src="evaluation.evaluator_avatar" class="history-avatar" />

                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between gap-3">
                      <strong>
                        {{ evaluation.evaluator_name }} {{ evaluation.evaluator_surname }}
                      </strong>

                      <span
                        class="badge"
                        :class="evaluation.status === 'completed' ? 'text-bg-success' : 'text-bg-warning'"
                      >
                        {{ evaluation.status }}
                      </span>
                    </div>

                    <div class="text-muted small">
                      Score: {{ evaluation.score ?? '--' }}
                    </div>

                    <p v-if="evaluation.feedback" class="mb-0 mt-2">
                      {{ evaluation.feedback }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid py-4" v-else>
        <div class="card shadow-sm">
          <div class="card-body">Loading project...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-page {
  background: #eef4fb;
  min-height: 100vh;
}

.project-breadcrumb {
  color: #64748b;
  font-size: 0.9rem;
}

.project-hero {
  position: relative;
  min-height: 360px;
  border-radius: 28px;
  overflow: hidden;
  background: #0f172a;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
}

.project-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.42;
}

.project-hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding: 44px;
  color: white;
}

.project-hero-content h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 16px;
}

.project-hero-content p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #dbeafe;
}

.project-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.metric-card {
  height: 100%;
  padding: 24px;
  border-radius: 22px;
  background: white;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.metric-card span {
  display: block;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.8rem;
}

.metric-card strong {
  display: block;
  margin: 8px 0;
  font-size: 2.4rem;
  line-height: 1;
}

.metric-card small {
  color: #64748b;
}

.project-list {
  display: grid;
  gap: 10px;
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
}

.project-list li {
  padding: 12px 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.history-list {
  display: grid;
}

.history-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.history-item:first-child {
  border-top: none;
}

.history-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
