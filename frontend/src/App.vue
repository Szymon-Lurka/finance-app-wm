<script lang="ts">
import {defineComponent, onBeforeMount} from "vue";
import {useCache} from "./composables/useCache";

export default defineComponent({
  setup() {
    const {validAllKeys} = useCache();
    onBeforeMount(() => {
      validAllKeys();
    })
  }
})
</script>

<template>
  <div class="app">
    <Toast />
    <router-view v-slot="{Component}">
      <component :is="Component"/>
    </router-view>
  </div>
</template>
