<script lang="ts">
import { defineComponent } from 'vue';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { useToastsService } from '@/composables/toasts';
import { lang } from '@/constants/lang';

export default defineComponent({
  setup() {
    const router = useRouter();
    const { dispatchErrorToast } = useToastsService();
    const {
      values: login,
      handleSubmit,
      errors,
    } = useForm({
      validationSchema: object({
        email: string()
          .required(lang.validation.nameRequired('Email'))
          .email(lang.validation.email),
      }),
      initialValues: {
        email: '',
      },
    });

    useField('email');

    const authStore = useAuthStore();

    const onSubmit = () => {
      handleSubmit(async ({ email }) => {
        try {
          await authStore.forgotPassword({ email });
        } catch (e) {
          console.log(e);
          if (e.response.status === 400 || e.response.status === 404) {
            dispatchErrorToast({
              title: lang.auth.titles.forgotPassword,
              details: lang.auth.error.details.notFound,
            });
          }
        }
      })();
    };

    const goToLogin = () => {
      router.push('/auth/login');
    };
    return {
      errors,
      onSubmit,
      login,
      goToLogin,
    };
  },
});
</script>

<template>
  <Card class="card">
    <template #header>
      <h2>Zresetuj hasło</h2>
    </template>
    <template #content>
      <form @submit.prevent="onSubmit()" class="form">
        <div class="form-group">
          <div class="form-field">
            <label for="email">Email</label>
            <InputText v-model="login.email" type="text" name="email" id="email" />
            <p></p>
          </div>
          <Button type="submit">Przypomnij hasło</Button>
          <Button @click="goToLogin">Zaloguj się</Button>
        </div>
      </form>
    </template>
  </Card>
</template>
