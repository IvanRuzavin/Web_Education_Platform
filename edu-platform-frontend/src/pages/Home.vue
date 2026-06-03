<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();

const projects = ref<any[]>([]);
const assignedEvaluations = ref<any[]>([]);
const evaluationScores = ref<Record<number, number>>({});
const evaluationFeedback = ref<Record<number, string>>({});

const user = ref<any>(null);
const users = ref<any[]>([]);
const selectedUser = ref<any>(null);
const actionMessage = ref("");
const actionError = ref("");

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

const loadProjects = async (targetUid: string) => {
  const res = await api.get(`/projects/${targetUid}`);
  projects.value = res.data;
};

const loadAssignedEvaluations = async () => {
  if (!uid) return;
  const res = await api.get(`/evaluations/assigned/${uid}`);
  assignedEvaluations.value = res.data;

  assignedEvaluations.value.forEach((item: any) => {
    if (!evaluationScores.value[item.evaluation_id]) {
      evaluationScores.value[item.evaluation_id] = 85;
    }

    if (!evaluationFeedback.value[item.evaluation_id]) {
      evaluationFeedback.value[item.evaluation_id] = "";
    }
  });
};

const loadUsers = async () => {
  const res = await api.get(`/users`);
  users.value = res.data;
};

const loadUser = async () => {
  const res = await api.get(`/users/${uid}`);
  user.value = res.data;

  await api.put(`/users/${uid}`, {
    is_online: 1
  });

  selectedUser.value = res.data;
  animateProgress(res.data.progress);
  await loadProjects(user.value.uid);
  await loadAssignedEvaluations();
};

const refreshCurrentUser = async () => {
  if (!uid) return;

  const res = await api.get(`/users/${uid}`);
  user.value = res.data;

  if (selectedUser.value?.uid === uid) {
    selectedUser.value = res.data;
  }
};

const openUser = async (u: any) => {
  const res = await api.get(`/users/${u.uid}`);
  selectedUser.value = res.data;

  animateProgress(res.data.progress);

  await loadProjects(u.uid);
};

const logout = async () => {
  await api.put(`/users/${uid}`, {
    is_online: 0
  });

  localStorage.removeItem("uid");
  localStorage.removeItem("token");
  router.push("/");
};

const isSelf = computed(() => {
  return selectedUser.value?.uid === user.value?.uid;
});

const readyForEvaluation = computed(() => Boolean(user.value?.ready_for_evaluation));

const toggleReadyForEvaluation = async () => {
  if (!uid || !user.value) return;

  actionMessage.value = "";
  actionError.value = "";

  await api.put(`/users/${uid}`, {
    ready_for_evaluation: readyForEvaluation.value ? 0 : 1
  });

  await refreshCurrentUser();
  await loadUsers();

  actionMessage.value = readyForEvaluation.value
    ? "You are now available for evaluation requests."
    : "You are no longer in the evaluation queue.";
};

const completeEvaluation = async (evaluation: any) => {
  actionMessage.value = "";
  actionError.value = "";

  try {
    await api.post(`/evaluations/${evaluation.evaluation_id}/complete`, {
      evaluator_user_id: uid,
      score: evaluationScores.value[evaluation.evaluation_id],
      feedback: evaluationFeedback.value[evaluation.evaluation_id]
    });

    actionMessage.value = "Evaluation completed. EVP and project score were recalculated.";
    await loadAssignedEvaluations();
    await refreshCurrentUser();
    await loadUsers();

    if (selectedUser.value?.uid) {
      await loadProjects(selectedUser.value.uid);
    }
  } catch (error: any) {
    actionError.value = error.response?.data?.error || "Unable to complete evaluation.";
  }
};

const openProject = (projectId: string) => {
  router.push({
    path: `/projects/${projectId}`,
    query: { uid: selectedUser.value?.uid || uid }
  });
};

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
        <div class="navbar-title">Embedded EDU Platform</div>

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

      <div class="container-fluid mt-4" v-if="selectedUser">
        <div v-if="actionMessage" class="alert alert-success">
          {{ actionMessage }}
        </div>

        <div v-if="actionError" class="alert alert-danger">
          {{ actionError }}
        </div>

        <div class="row g-3">
          <div class="col-lg-8">
            <div class="card shadow-sm profile-card h-100">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-md-3 text-center">
                    <img :src="selectedUser.avatar" class="profile-avatar" />
                  </div>

                  <div class="col-md-9">
                    <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                      <div>
                        <h2 class="fw-bold mb-1">
                          {{ selectedUser.name }} {{ selectedUser.surname }}
                        </h2>

                        <p class="text-muted mb-2">{{ selectedUser.uid }}</p>
                      </div>

                      <span
                        class="queue-badge"
                        :class="selectedUser.ready_for_evaluation ? 'ready' : 'not-ready'"
                      >
                        <i class="bi bi-person-check"></i>
                        {{ selectedUser.ready_for_evaluation ? 'Ready to evaluate' : 'Not in evaluation queue' }}
                      </span>
                    </div>

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
                <div>
                  <strong>XP</strong>
                  <div>{{ selectedUser.experience }}</div>
                </div>
                <div>
                  <strong>Rank</strong>
                  <div>{{ selectedUser.rank }}</div>
                </div>
                <div>
                  <strong>EVP</strong>
                  <div>{{ selectedUser.evaluation_points }} / 3</div>
                </div>
                <div>
                  <strong>Projects</strong>
                  <div v-if="projects.length === 0">No projects yet</div>
                  <div v-if="projects.length > 0">{{ projects.length }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <button
              class="btn btn-primary w-100 mb-3"
              @click="router.push({ path: '/graph', query: { uid: selectedUser.uid } })"
            >
              Project Graph
            </button>

            <button
              v-if="isSelf"
              class="btn btn-success w-100 mb-3"
              @click="router.push('/settings')"
            >
              Update Profile
            </button>

            <div class="card shadow-sm mb-3" v-if="isSelf">
              <div class="card-header">
                <h5 class="mb-0">Evaluation Queue</h5>
              </div>

              <div class="card-body">
                <p class="text-muted small mb-3">
                  Switch this on when you are ready to evaluate somebody else's defense.
                  Completing an assigned evaluation gives you 1 EVP, up to the maximum of 3.
                </p>

                <button
                  class="btn w-100"
                  :class="readyForEvaluation ? 'btn-outline-danger' : 'btn-outline-primary'"
                  @click="toggleReadyForEvaluation"
                >
                  {{ readyForEvaluation ? 'Leave evaluation queue' : 'I am ready to evaluate' }}
                </button>
              </div>
            </div>

            <div class="card shadow-sm h-80">
              <div class="card-header">
                <h5 class="mb-0">Personal Information</h5>
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
        </div>

        <div class="row g-3 mt-1" v-if="isSelf">
          <div class="col-12">
            <div class="card shadow-sm evaluation-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Assigned Evaluations</h5>
                <span class="badge text-bg-primary">{{ assignedEvaluations.length }}</span>
              </div>

              <div class="card-body" v-if="assignedEvaluations.length === 0">
                <p class="text-muted mb-0">
                  No pending evaluations assigned to you yet.
                </p>
              </div>

              <div class="evaluation-list" v-else>
                <div
                  v-for="evaluation in assignedEvaluations"
                  :key="evaluation.evaluation_id"
                  class="evaluation-item"
                >
                  <img :src="evaluation.evaluated_avatar" class="evaluation-avatar" />

                  <div class="evaluation-main">
                    <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <div>
                        <h6 class="mb-1">{{ evaluation.project_name }}</h6>
                        <div class="text-muted small">
                          Defense by {{ evaluation.evaluated_name }} {{ evaluation.evaluated_surname }}
                          · {{ evaluation.peripheral }}
                        </div>
                      </div>

                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="router.push({ path: `/projects/${evaluation.project_id}`, query: { uid: evaluation.evaluated_user_id } })"
                      >
                        View project
                      </button>
                    </div>

                    <div class="row g-2 mt-2 align-items-end">
                      <div class="col-md-2">
                        <label class="form-label small">Score</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          class="form-control"
                          v-model.number="evaluationScores[evaluation.evaluation_id]"
                        />
                      </div>

                      <div class="col-md-7">
                        <label class="form-label small">Feedback</label>
                        <input
                          class="form-control"
                          placeholder="Optional short feedback"
                          v-model="evaluationFeedback[evaluation.evaluation_id]"
                        />
                      </div>

                      <div class="col-md-3">
                        <button
                          class="btn btn-success w-100"
                          @click="completeEvaluation(evaluation)"
                        >
                          Complete evaluation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3 mt-1">
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
                  <div class="d-flex align-items-center gap-3">
                    <img :src="u.avatar" class="user-avatar" />
                    <div>
                      <span class="fw-semibold">{{ u.uid }}</span>
                      <div class="small text-muted">
                        EVP {{ u.evaluation_points }}/3
                        <span v-if="u.ready_for_evaluation">· ready to evaluate</span>
                      </div>
                    </div>
                  </div>

                  <span
                    class="status-dot"
                    :class="u.is_online ? 'online' : 'offline'"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5>User Projects</h5>
              </div>

              <div class="list-group">
                <button
                  v-for="p in projects"
                  :key="p.project_id"
                  class="list-group-item project-item"
                  @click="openProject(p.project_id)"
                >
                  <div>
                    <span>{{ p.project_name }}</span>
                    <div class="small text-muted">
                      Evaluations {{ p.completed_evaluations }}/2
                      <span v-if="p.pending_evaluations">· {{ p.pending_evaluations }} pending</span>
                    </div>
                  </div>

                  <span
                    class="project-score"
                    :class="p.score >= 85 ? 'good' : 'bad'"
                  >
                    {{ p.score }}
                  </span>
                </button>
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
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
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

.queue-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.queue-badge.ready {
  color: #166534;
  background: #dcfce7;
}

.queue-badge.not-ready {
  color: #475569;
  background: #f1f5f9;
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
  z-index: 10;
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
  object-fit: cover;
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
  text-align: left;
  cursor: pointer;
}

.project-item:hover {
  background: #f8fafc;
}

.project-score {
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 10px;
  color: white;
}

.good {
  background: #22c55e;
}

.bad {
  background: #ef4444;
}

.evaluation-card {
  overflow: hidden;
}

.evaluation-list {
  display: grid;
}

.evaluation-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.evaluation-item:first-child {
  border-top: none;
}

.evaluation-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.evaluation-main {
  flex: 1;
}
</style>
