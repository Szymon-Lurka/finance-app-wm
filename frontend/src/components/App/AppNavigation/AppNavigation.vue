<script lang="ts">
import {computed, defineComponent} from "vue";
import {useUiStore} from "@/stores/uiStore";
import {useDarkMode} from "@/composables/useDarkMode";
import {useAuthStore} from "@/stores/authStore";
import AppDarkModeSwitcher from "@/components/App/AppDarkModeSwitcher/AppDarkModeSwitcher.vue";

export default defineComponent({
  components: {AppDarkModeSwitcher},
  setup() {
    const uiStore = useUiStore();
    const {currentMode} = useDarkMode();
    const authStore = useAuthStore();
    const isMenuOpen = computed(() => uiStore.isMenuOpen);


    const logout = () => {
      authStore.signOut();
    }
    const openMenu = () => uiStore.toggleMenu();
    return {
      logout,
      currentMode,
      openMenu,
      isMenuOpen,
      isUserLoaded: true,
    }

  }
})
</script>

<template>
  <aside class="app-menu" :class="[isMenuOpen ? 'app-menu--is-active' : null]">
    <div class="app-menu__inner">
      <main class="app-menu__content">
        <header class="app-menu__header">
          <div class="app-menu__header-info">
            Cześć Szymon!
            <br>
            logo?
          </div>
          <el-divider/>
          <el-menu>
            <el-menu-item>
              <router-link to="/dashboard/home">
                <font-awesome-icon icon="home" size="xl"/>
              </router-link>
            </el-menu-item>
            <el-menu-item>
              <router-link to="/dashboard/categories">
                <font-awesome-icon icon="list" size="xl"/>
              </router-link>
            </el-menu-item>
          </el-menu>
          <br/>
          <el-dropdown class="app-navigation__settings" trigger="click" placement="top">
          <span class="el-dropdown-link">
            <div class="app-navigation__info-trigger">
              <font-awesome-icon icon="gear" size="xl"/>
            </div>
          </span>

            <template #dropdown>
              <el-dropdown-menu class="app-navigation__dropdown">
                <el-dropdown-item>
                  <app-dark-mode-switcher/>

                </el-dropdown-item>

                <el-dropdown-item divided @click="logout()">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </header>
        <el-divider/>
        <footer class="app-menu__bottom">
        </footer>
      </main>
    </div>

    <div
        class="app-menu__overlay"
        :class="[isMenuOpen ? null : 'app-menu__overlay--is-active']"
    />
  </aside>
</template>
<style src="./AppNavigation.scss" lang="scss" scoped/>