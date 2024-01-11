<script lang="ts">
import {defineComponent} from "vue";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "vue-router";
import {useToastsService} from "@/composables/toasts";
import {lang} from "@/constants/lang";

export default defineComponent({
  setup() {
    const router = useRouter();
    const {dispatchErrorToast} = useToastsService();
    const {
      values: login,
      handleSubmit,
      errors
    } = useForm({
      validationSchema: object({
        email: string().required(lang.validation.nameRequired('Email')).email(lang.validation.email),
        password: string().required('Hasło jest wymagane').min(8, lang.validation.min(8, 'Hasło'))
      }),
      initialValues: {
        email: '',
        password: ''
      }
    });

    useField('email');
    useField('password');

    const authStore = useAuthStore();

    const onSubmit = () => {
      handleSubmit(async ({email, password}) => {
        try {
          await authStore.signIn({email, password})
        } catch (e) {
          console.log(e);
          if (e.response.status === 400 || e.response.status === 404) {
            dispatchErrorToast({title: lang.auth.titles.login, details: lang.auth.error.details.exists});
          } else {
            dispatchErrorToast({title: lang.auth.titles.login, details: lang.auth.error.details.login});
          }
        }
      })();
    }

    const goToRegister = () => {
      router.push('/auth/register')
    }

    return {
      errors,
      onSubmit,
      login,
      goToRegister,
    }
  }
})
</script>

<template>
  <Card class="card">
    <template #header>
      <h2>Zaloguj się</h2>
    </template>
    <template #content>
      <form @submit.prevent="onSubmit()" class="form">
        <div class="form-group">
          <div class="form-field">
            <label for="email">Email</label>
            <InputText v-model="login.email" type="text" name="email" id="email"/>
            <p></p>
          </div>
          <div class="form-field">
            <label for="password">Hasło</label>
            <InputText v-model="login.password" type="password" name="password" id="password"/>
          </div>
          <Button type="submit">Zaloguj się</Button>
          <Button severity="info" @click="goToRegister">
            Zarejestruj się
          </Button>
        </div>
      </form>
    </template>
  </Card>
</template>
