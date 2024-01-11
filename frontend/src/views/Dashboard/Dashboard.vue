<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import AppNavigation from "@/components/App/AppNavigation/AppNavigation.vue";
import AppTopbar from "@/components/App/AppTopbar/AppTopbar.vue";
import {useUiStore} from "@/stores/uiStore";
import {useUserStore} from "@/stores/userStore";

export default defineComponent({
  components: {AppNavigation, AppTopbar},
  setup() {
    const uiStore = useUiStore();
    const userStore = useUserStore();

    const isUserLoaded = computed(() => userStore.isUserLoaded);
    const layoutState = uiStore.layoutState;
    const layoutConfig = uiStore.layoutConfig;

    const outsideClickListener = ref(null);

    const containerClass = computed(() => {
      return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'layout-theme-light': layoutConfig.darkTheme === 'light',
        'layout-theme-dark': layoutConfig.darkTheme === 'dark',
      };
    });

    watch(uiStore.isSidebarActive, (newVal) => {
      if (newVal) {
        bindOutsideClickListener();
      } else {
        unbindOutsideClickListener();
      }
    });
    const bindOutsideClickListener = () => {
      if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
          if (isOutsideClicked(event)) {
            layoutState.overlayMenuActive = false;
            layoutState.staticMenuMobileActive = false;
            layoutState.menuHoverActive = false;
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
    const isOutsideClicked = (event) => {
      const sidebarEl = document.querySelector('.layout-sidebar');
      const topbarEl = document.querySelector('.layout-menu-button');
      return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
    };

    onMounted(async () => {
      await userStore.fetchMe();
      await userStore.fetchBalance();
    })

    return {
      containerClass,
      isUserLoaded
    }
  }
})
</script>

<template>
  <div class="layout-wrapper" :class="containerClass" v-if="isUserLoaded">
    <app-topbar></app-topbar>
    <div class="layout-sidebar">
      <app-navigation/>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view v-slot="{Component, route}">
          <transition name="fade" mode="out-in">
            <div :key="route.name">
              <component :is="Component"/>
            </div>
          </transition>
        </router-view>
      </div>
    </div>
    <div class="layout-mask"></div>

  </div>
</template>
