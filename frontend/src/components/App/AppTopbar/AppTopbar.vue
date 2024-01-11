<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useUiStore} from "@/stores/uiStore";
import {useAuthStore} from "@/stores/authStore";

export default defineComponent({
  setup() {
    const router = useRouter();
    const uiStore = useUiStore();
    const topbarMenuActive = ref(false);
    const outsideClickListener = ref(null);
    const authStore = useAuthStore();

    const onLogout = () => {
      authStore.signOut();
    }

    onMounted(() => {
      bindOutsideClickListener();
    });

    onBeforeUnmount(() => {
      unbindOutsideClickListener();
    });

    const bindOutsideClickListener = () => {
      if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
          if (isOutsideClicked(event)) {
            topbarMenuActive.value = false;
          }
        };
        document.addEventListener('click', outsideClickListener.value);
      }
    };
    const unbindOutsideClickListener = () => {
      if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
      }
    };
    const topbarMenuClasses = computed(() => {
      return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
      };
    });

    const isOutsideClicked = (event) => {
      if (!topbarMenuActive.value) return;

      const sidebarEl = document.querySelector('.layout-topbar-menu');
      const topbarEl = document.querySelector('.layout-topbar-menu-button');

      return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
    };
    const onTopBarMenuButton = () => {
      topbarMenuActive.value = !topbarMenuActive.value;
    };
    const onMenuToggle = () => {
      uiStore.onMenuToggle();
    };
    return {
      onMenuToggle,
      onTopBarMenuButton,
      topbarMenuClasses,
      onLogout
    }
  }
})
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/dashboard" class="layout-topbar-logo">
      Finansowa wolność
    </router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <button class="p-link layout-topbar-button">
        <i class="pi pi-cog"></i>
        <span>Settings</span>
      </button>
      <button class="p-link layout-topbar-button" @click="onLogout">
        <i class="pi pi-power-off"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

