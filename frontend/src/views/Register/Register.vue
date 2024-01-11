<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useIsFormDirty} from "@/composables/isFormDirty";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "vue-router";
import {PASSWORD_VALIDATION_REGEX} from "@/constants/regexes";
import {useToastsService} from "@/composables/toasts";
import {lang} from "@/constants/lang";

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
    const {dispatchSuccessToast, dispatchErrorToast} = useToastsService();
    const canShowErrors = ref(false);
    const {
      values,
      handleSubmit,
      errors
    } = useForm({
      validationSchema: object({
        password: string().required('').matches(PASSWORD_VALIDATION_REGEX, lang.validation.password),
        email: string().required('Email jest wymagany').email(lang.validation.email),
        firstName: string().required('Imię jest wymagane').min(3, lang.validation.min(3, 'Imię')),
        lastName: string().required('Nazwisko jest wymagane').min(3, lang.validation.min(3, 'Nazwisko')),
        username: string().required('Nazwa użytkownika jest wymagana').min(3, lang.validation.min(3, 'Nazwa użytkownika'))
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
          dispatchSuccessToast({details: lang.auth.success.details.register, title: lang.auth.titles.register})
          canShowErrors.value = false;
          goToLogin();
        } catch (e) {
          console.log(e);
          if (e.response.data.isDuplicates) {
            dispatchErrorToast({title: lang.auth.titles.register, details: lang.auth.error.details.exists})
          } else {
            dispatchErrorToast({title: lang.auth.titles.register, details: lang.auth.error.details.register})
          }
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
