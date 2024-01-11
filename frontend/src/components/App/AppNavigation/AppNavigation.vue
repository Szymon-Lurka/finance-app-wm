<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {useUiStore} from "@/stores/uiStore";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "vue-router";

export default defineComponent({
  setup() {
    const uiStore = useUiStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const itemClick = (type: string) => {
      const {overlayMenuActive, staticMenuMobileActive} = uiStore.layoutState;
      if (overlayMenuActive || staticMenuMobileActive) {
        uiStore.onMenuToggle();
      }
      router.push('/dashboard/' + type);
    }


    const logout = () => {
      authStore.signOut();
    }
    return {
      logout,
      itemClick,
      isUserLoaded: true,
    }

  }
})
</script>

<template>
  <ul class="layout-menu">
    <li @click="itemClick('categories')">
      <Button badge="XD">Kategorie</Button>
    </li>
    <li @click="itemClick('entries')">
      <Button badge="XD">Wpisy</Button>
    </li>
    <li @click="itemClick('raports')">
      <Button>Raporty</Button>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
button {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
}
</style>