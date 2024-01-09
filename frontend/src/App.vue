<script lang="ts">
import {authService} from "./api/services/auth";

export default {
  async setup() {
    try {
      const test = await authService.login({
        password: 'Polaczek5%',
        lastName: 'last',
        firstName: 'Szimi',
        username: 'nick2',
        email: 'szymek3@o2.pl'
      })
      console.log(test);
    } catch (e) {
      console.log(e);
    }
  }
}

</script>

<template>
  <div>Finansowa wolność</div>
  <p>Test github actions x x test</p>
</template>
