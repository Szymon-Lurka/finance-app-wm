<script lang="ts">
import router from '@/router';
import { defineComponent, ref, computed, pushScopeId } from 'vue';

interface Form {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default defineComponent({
  setup() {
    const form = ref<Form>({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
    });
    const triedToSubmit = ref('');
    const PASSWORD_VALIDATION_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let isPasswordValid = undefined;
    const submitForm = async () => {
      let isPasswordValid = computed(() => PASSWORD_VALIDATION_REGEX.test(form.value.password));

      if (!isPasswordValid.value) {
        triedToSubmit.value =
          'Password need to be minimum eight characters, at least one letter, one number and one special character';
        throw new Error(
          'Password need to be minimum eight characters, at least one letter, one number and one special character'
        );
      }

      try {
        const response = await fetch('http://localhost:3001/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value),
        });

        const result = await response.json();
        if (result.status === 'error') {
          triedToSubmit.value = result.message;
          throw new Error(result.message);
        }

        await router.push('/auth/login');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return { form, submitForm, isPasswordValid, triedToSubmit };
  },
});
</script>

<template>
  <section class="registration-form">
    <form @submit.prevent="submitForm" class="registration-form__form">
      <fieldset class="registration-form__fieldset">
        <legend>Register</legend>

        <div class="registration-form__field">
          <label for="username" class="registration-form__label">Username:</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            required
            class="registration-form__input"
            minlength="3"
          />
        </div>

        <div class="registration-form__field">
          <label for="password" class="registration-form__label">Password:</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            class="registration-form__input"
          />
        </div>

        <div class="registration-form__field">
          <label for="email" class="registration-form__label">Email:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            class="registration-form__input"
          />
        </div>

        <div class="registration-form__field">
          <label for="firstName" class="registration-form__label">First Name:</label>
          <input
            type="text"
            id="firstName"
            v-model="form.firstName"
            required
            class="registration-form__input"
            minlength="3"
          />
        </div>

        <div class="registration-form__field">
          <label for="lastName" class="registration-form__label">Last Name:</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            required
            class="registration-form__input"
            minlength="3"
          />
        </div>
        <div class="password-invalid">
          {{ triedToSubmit }}
        </div>
        <button type="submit" class="registration-form__submit">Register</button>
      </fieldset>
    </form>
  </section>
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
