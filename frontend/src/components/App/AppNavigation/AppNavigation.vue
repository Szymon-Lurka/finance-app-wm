<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({})
</script>

<template>
  <nav class="app-navigation">
    <router-link to="/dashboard/home" title="home" aria-label="home">
      home
    </router-link>
    <router-link to="/dashboard/categories" title="categories" aria-label="categories">
      categories
    </router-link>
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  position: fixed;
  width: 280px;
  height:100vh;
  background-color: #c0c0c0;
}
</style>