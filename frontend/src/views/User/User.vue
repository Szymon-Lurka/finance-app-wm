<script lang="ts">
import {defineComponent} from "vue";
import FormsUserData from "@/components/Forms/UserData/FormsUserData.vue";
import UserPassword from "@/components/Forms/UserPassword/UserPassword.vue";

export default defineComponent({
  components: {UserPassword, FormsUserData},
})
</script>

<template>
  <div class="app">
    <div class="cards-container">
      <FormsUserData/>
      <UserPassword/>
    </div>
  </div>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.cards-container {
  display: flex;
  justify-content: space-between;
  @media(max-width:768px) {
    flex-direction: column;
    gap: 60px;
  }

  .card {
    flex-basis: 47.5%;
    :deep(button) {
      width: 25%;
      display: flex;
      align-self: center;
      justify-self: flex-end;
      justify-content: center;
    }
  }
}

</style>