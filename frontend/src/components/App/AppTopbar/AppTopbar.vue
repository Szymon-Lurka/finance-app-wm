<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useUiStore} from "@/stores/uiStore";
import {useAuthStore} from "@/stores/authStore";
import {useUserStore} from "@/stores/userStore";

export default defineComponent({
  setup() {
    const router = useRouter();
    const uiStore = useUiStore();
    const topbarMenuActive = ref(false);
    const outsideClickListener = ref(null);
    const userStore = useUserStore();
    const balance = computed(() => userStore.getBalance);
    const authStore = useAuthStore();

    const onLogout = () => {
      authStore.signOut();
    }

    const onUserClick = () => {
      router.push('/dashboard/user');
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
      onLogout,
      balance,
      onUserClick
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
      <badge v-if="balance" size="large" :severity="balance > 0 ? 'success' : 'danger'">
        {{ balance }} zł
      </badge>
      <badge v-else size="large">
        0 zł
      </badge>
      <button @click="onUserClick()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profil</span>
      </button>
      <button class="p-link layout-topbar-button" @click="onLogout">
        <i class="pi pi-power-off"></i>
        <span>Wyloguj</span>
      </button>
    </div>
  </div>
</template>
