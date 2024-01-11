<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {useUiStore} from "@/stores/uiStore";
import {useAuthStore} from "@/stores/authStore";

export default defineComponent({
  setup() {
    const uiStore = useUiStore();
    const authStore = useAuthStore();
    const itemClick = () => {
      const {overlayMenuActive, staticMenuMobileActive} = uiStore.layoutState;
      if (overlayMenuActive || staticMenuMobileActive) {
        uiStore.onMenuToggle();
      }
    }
    const items = ref([
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'Categories',
        icon: 'pi pi-star'
      },
    ])


    const logout = () => {
      authStore.signOut();
    }
    return {
      logout,
      itemClick,
      isUserLoaded: true,
      items,
    }

  }
})
</script>

<template>
  <ul class="layout-menu">
    <li @click="itemClick">
      <router-link to="/dashboard/categories">Categories</router-link>
    </li>
  </ul>
</template>
