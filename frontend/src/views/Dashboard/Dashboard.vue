<script lang="ts">
import {defineComponent, ref} from "vue";
import AppNavigation from "@/components/App/AppNavigation/AppNavigation.vue";

export default defineComponent({
  components: {AppNavigation},
})
</script>

<template>
  <div class="app">
    <app-navigation/>
    <main class="app__content">
      <div class="app__content-inner">
        <router-view v-slot="{Component, route}">
          <transition name="fade" mode="out-in">
            <div :key="route.name">
              <component :is="Component"/>
            </div>
          </transition>

        </router-view>
      </div>
    </main>
  </div>
</template>
<style src="./Dashboard.scss" scoped lang="scss"></style>
