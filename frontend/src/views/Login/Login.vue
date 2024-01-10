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
      console.log(email, password);
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
  <el-form status-icon label-position="top" class="auth-details__form" @submit.prevent="onSubmit()">
    <el-form-item label="Email" :error="errors.email">
      <el-input
          v-model="login.email"
          type="text"
          autocomplete="off"
          placeholder="email@o2.pl"
      />
    </el-form-item>
    <el-form-item label="Email" :error="errors.password">
      <el-input
          v-model="login.password"
          type="password"
          autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button
          type="primary"
          native-type="submit"
      >Login
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
</style>