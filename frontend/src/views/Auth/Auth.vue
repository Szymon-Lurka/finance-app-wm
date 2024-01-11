<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
})
</script>

<template>
  <div class="layout-container">
    <div class="background" />
    <router-view v-slot="{Component, route}">
      <transition name="fade" mode="out-in">
        <div :key="route.name" class="layout-main">
          <component :is="Component"/>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="scss">
div.background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top:0;
  left:0;
  bottom:0;
  background-image: url("@/assets/images/money.jpg");
  z-index: -1;
  filter: brightness(70%);
}
.layout-main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  :deep(.card) {
    width: 40%;
    height: 35%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    @media(max-width: 768px) {
      width: 85%;
    }
  }
  :deep(.card-high) {
    height: 53%;
    width: 45%;
    @media(max-width:768px) {
      width: 90%;
    }
  }
  :deep(.card-high-errors) {
    height: 60%;
  }
}
</style>
