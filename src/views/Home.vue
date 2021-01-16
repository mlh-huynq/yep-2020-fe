<template>
  <div class="nav">
    <h1>Chọn khu vực</h1>
    <router-link to="/ha-noi" class="btn btn-primary">Hà Nội</router-link>
    <router-link to="/da-nang" class="btn btn-primary">Đà Nẵng</router-link>
  </div>
</template>

<style lang="scss" scpoed>
.nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-bottom: 50px;
  .btn {
    min-width: 200px;
    margin-bottom: 12px;
  }
}
</style>
