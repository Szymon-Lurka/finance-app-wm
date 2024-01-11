<script lang="ts">
import {defineComponent} from "vue";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const {
      values: login,
      handleSubmit,
      errors
    } = useForm({
      validationSchema: object({
        email: string().required('Email jest wymagany').email('Email jest nieprawidłowy'),
        password: string().required('Hasło jest wymagane').min(8, 'Hasło musi zawierać conajmniej 8 znaków')
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
