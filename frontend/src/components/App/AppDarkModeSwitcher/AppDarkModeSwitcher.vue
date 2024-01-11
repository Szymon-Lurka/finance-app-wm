<template>
  <span class="app-dark-mode-switcher">
    <el-switch
        class="app-dark-mode-switcher__button"
        :active-icon="moonIcon"
        :inactive-icon="sunnyIcon"
        inline-prompt
        :model-value="currentMode"
        @change="toggleMode"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Moon as moonIcon, Sunny as sunnyIcon } from '@element-plus/icons-vue';
import { useDarkMode } from '@/composables/useDarkMode';

export default defineComponent({
  name: 'AppDarkModeSwitcher',
  setup() {
    const { currentMode, toggleMode } = useDarkMode();

    return {
      currentMode,
      toggleMode,
      moonIcon,
      sunnyIcon,
    };
  },
});
</script>

<style lang="scss" src="./AppDarkModeSwitcher.scss" />
