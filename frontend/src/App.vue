<script lang="ts">
import {defineComponent, onBeforeMount} from "vue";
import {useDarkMode} from "./composables/useDarkMode";
import {useCache} from "./composables/useCache";

export default defineComponent({
  setup() {
    const {initColorMode} = useDarkMode();
    const {validAllKeys} = useCache();
    onBeforeMount(() => {
      validAllKeys();
      initColorMode();
    })
  }
})
</script>

<template>
  <div class="app">
    <router-view v-slot="{Component}">
          <component :is="Component"/>
    </router-view>
  </div>
</template>
