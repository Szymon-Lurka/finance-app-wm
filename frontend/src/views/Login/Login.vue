<script lang="ts">
import {defineComponent} from "vue";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useAuthStore} from "@/stores/authStore";

export default defineComponent({
  setup() {
    const {
      values: login,
      handleSubmit,
      errors
    } = useForm({
      validationSchema: object({
        email: string().required().email().label('Pole email jest nieprawidłowe'),
        password: string().required().min(8).label('Pole hasło jest nieprawidłowe')
      }),
      initialValues: {
        email: '',
        password: ''
      }
    });

    useField('email');
    useField('password');

    const authStore = useAuthStore();

    const onSubmit = handleSubmit(async ({email, password}) => {
      try {
        await authStore.signIn({email, password})
      } catch (e) {
        console.log(e);
      }
    })
    return {
      errors,
      onSubmit,
      login
    }
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit()">
    <div class="u-form-field">
      <label for="email">Email</label>
      <InputText v-model="login.email" type="text" name="email" id="email"/>
    </div>
    <div class="u-form-field">
      <label for="password">Hasło</label>
      <InputText v-model="login.password" type="password" name="password" id="password"/>
    </div>
    <Button type="submit">Login</Button>
  </form>
</template>

<style scoped lang="scss">
</style>