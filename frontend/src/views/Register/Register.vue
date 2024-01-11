<script lang="ts">
import {defineComponent, ref, computed, pushScopeId} from 'vue';
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useIsFormDirty} from "@/composables/isFormDirty";
import {useAuthStore} from "@/stores/authStore";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {PASSWORD_VALIDATION_REGEX} from "@/constants/regexes";

interface Form {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();
    const canShowErrors = ref(false);
    const {
      values,
      handleSubmit,
      errors
    } = useForm({
      validationSchema: object({
        password: string().required('').matches(PASSWORD_VALIDATION_REGEX, 'Hasło musi mieć przynajmniej 8 znaków i zawierać przynajmniej 1 wielką literę, 1 symbol i 1 cyfrę.'),
        email: string().required('Email jest wymagany').email('Email musi być poprawnym adresem e-mail'),
        firstName: string().required('Imię jest wymagane').min(3, 'Imię musi mieć przynajmniej 3 znaki'),
        lastName: string().required('Nazwisko jest wymagane').min(3, 'Imię musi mieć przynajmniej 3 znaki'),
        username: string().required('Nazwa użytkownika jest wymagana').min(3, 'Nazwa użytkownika musi mieć przynajmniej 3 znaki')
      }),
      initialValues: {
        password: null,
        email: null,
        firstName: null,
        lastName: null,
        username: null
      }
    });

    const password = useField('password');
    const email = useField('email');
    const firstName = useField('firstName');
    const lastName = useField('lastName');
    const username = useField('username');

    const isFormDirty = useIsFormDirty([password, email, firstName, lastName, username]);

    const onSubmit = () => {
      canShowErrors.value = true;
      handleSubmit(async ({password, email, firstName, lastName, username}) => {
        try {
          await authStore.register({email, password, firstName, lastName, username});
          toast.add({detail: 'Pomyślnie utworzono konto', severity: 'success', life: 3000, summary: 'Tworzenie konta'})
          canShowErrors.value = false;
          goToLogin();
        } catch (e) {
          console.log(e);
          toast.add({detail: 'Nie udało się stworzyć konta', severity: 'error', life: 3000, summary: 'Tworzenie konta'})
        }
      })();
    }

    const goToLogin = () => {
      router.push('/auth/login')
    }
    return {
      values,
      errors,
      onSubmit,
      isFormDirty,
      goToLogin,
      canShowErrors,
    }
  },
});
</script>

<template>
  <Card class="card card-high" :class="{'card-high-errors': canShowErrors}">
    <template #header>
      <h2>
        Zarejestruj się
      </h2>
    </template>
    <template #content>
      <form @submit.prevent="onSubmit" class="form">
        <div class="form-group">
          <div class="form-field">
            <label for="email">Email</label>
            <InputText type="text" v-model="values.email" name="email" id="email"/>
            <p class="u-error-msg" v-if="canShowErrors && errors.email">{{ errors.email }}</p>
          </div>
          <div class="form-field">
            <label for="password">Hasło</label>
            <InputText type="password" v-model="values.password" name="password" id="password"/>
            <p class="u-error-msg" v-if="canShowErrors && errors.password">{{ errors.password }}</p>
          </div>
          <div class="form-field">
            <label for="username">Nazwa użytkownika</label>
            <InputText type="text" v-model="values.username" name="username" id="username"/>
            <p class="u-error-msg" v-if="canShowErrors && errors.username">{{ errors.username }}</p>
          </div>
          <div class="form-field">
            <label for="firstName">Imię</label>
            <InputText type="text" v-model="values.firstName" name="firstName" id="firstName"/>
            <p class="u-error-msg" v-if="canShowErrors && errors.firstName">{{ errors.firstName }}</p>
          </div>
          <div class="form-field">
            <label for="lastName">Nazwisko</label>
            <InputText type="text" v-model="values.lastName" name="lastName" id="lastName"/>
            <p class="u-error-msg" v-if="canShowErrors && errors.lastName">{{ errors.lastName }}</p>
          </div>
          <Button type="submit">Zarejestruj się</Button>
          <Button severity="info" @click="goToLogin">Przejdź do logowania</Button>
        </div>
      </form>
    </template>
  </Card>
</template>
<style scoped lang="scss">
.registration-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;

  &__fieldset {
    border: none;
    margin: 0;
    padding: 0;

    legend {
      font-size: 1.2em;
      margin-bottom: 10px;
    }
  }

  &__field {
    margin-bottom: 15px;
  }

  &__label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  &__input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .password-invalid {
    color: red;
    margin-top: 5px;
  }

  &__submit {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
