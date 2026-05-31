<template>
  <router-view />
</template>


<style>

.dashboard {
  display: flex;
  min-height: 100vh;
  background: #0e2342;
}

.sidebar {
  width: 90px;
  background: #212529;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  gap: 20px;
}

.sidebar-home {
  border: none;
  background: transparent;
  color: white;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-home i {
  font-size: 2rem;
}

.sidebar-icon {
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 12px;
  background: #343a40;
  color: white;
  font-size: 1.3rem;
}

.sidebar-icon:hover {
  background: #0d6efd;
}

.main-content {
  flex: 1;
}

.top-navbar {
  height: 70px;
  background: white;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.navbar-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.user-navbar-btn {
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-avatar {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
  margin: auto;
}

.card {
  border: none;
  border-radius: 16px;
}

</style>