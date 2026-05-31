<template>
  <div class="layout">

    <aside class="sidebar">
      <div class="logo">
        EDU
      </div>

      <RouterLink to="/">
        Profile
      </RouterLink>

      <RouterLink to="/graph">
        Projects
      </RouterLink>
    </aside>

    <main class="content">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 80px;
  background: #4e5566;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.sidebar a {
  color: white;
  margin-top: 30px;
  text-decoration: none;
}

.logo {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.content {
  flex: 1;
  background: #f5f5f5;
}

</style>