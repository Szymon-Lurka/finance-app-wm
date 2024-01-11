<script lang="ts">
import {defineComponent, computed, ref, watch} from "vue";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useUserStore} from "@/stores/userStore";
import {useToast} from "primevue/usetoast";
import {User} from "@/types/models/Auth";
import {useIsFormDirty} from "@/composables/isFormDirty";
import {userService} from "@/api/services/user";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const toast = useToast();
    const user = computed(() => userStore.getUser as User);
    const showUserDataErrors = ref(false);

    const {
      values: userData,
      handleSubmit: handleUserDataSubmit,
      errors: userDataErrors,
      resetForm
    } = useForm({
      validationSchema: object({
        firstName: string().min(3,'Imię musi mieć przynajmniej 3 znaki'),
        lastName: string().min(3,'Imię musi mieć przynajmniej 3 znaki'),
        username: string().min(3,'Nazwa użytkownika musi mieć przynajmniej 3 znaki')
      }),
      initialValues: {
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        username: user.value.username
      }
    });
    watch(user, () => {
      resetForm({
        values: {
          firstName: user.value.firstName,
          lastName: user.value.lastName,
          username: user.value.username
        }
      })
    })
    const firstName = useField('firstName');
    const lastName = useField('lastName');
    const username = useField('username');
    const isUserDataFormDirty = useIsFormDirty([firstName, lastName, username]);
    const onSubmitUserData = () => {
      showUserDataErrors.value = true;
      handleUserDataSubmit(async ({firstName, lastName, username}) => {
        const [fName, lName, uName] = [firstName, lastName, username].map((field) => field === '' ? null : field);
        try {
          await userService.updateUser({firstName: fName, lastName: lName, username: uName});
          await userStore.fetchMe();
          toast.add({severity: 'success', summary: 'Aktualizacja', detail: 'Pomyślnie zaktualizowano dane', life: 3000})
        } catch (e) {
          console.log(e);
          toast.add({
            severity: 'error',
            summary: 'Aktualizacja',
            detail: 'Nie udało się zaktualizować danych',
            life: 3000
          })
        }
      })();
    }
    return {
      userDataErrors,
      showUserDataErrors,
      userData,
      onSubmitUserData,
      isUserDataFormDirty
    }
  }
})
</script>

<template>
  <Card class="card">
    <template #title>Zmień swoje dane</template>
    <template #content>
      <form @submit.prevent="onSubmitUserData">
        <div class="form-group">
          <div class="form-field">
            <label for="firstName">Imię</label>
            <InputText v-model="userData.firstName" id="firstName" type="text" placeholder="Jacek"/>
            <p class="u-error-msg" v-if="showUserDataErrors && userDataErrors.firstName">{{ userDataErrors.firstName }}</p>
          </div>
          <div class="form-field">
            <label for="lastName">Nazwisko</label>
            <InputText v-model="userData.lastName" id="lastName" type="text" placeholder="Kowalski"/>
            <p class="u-error-msg" v-if="showUserDataErrors && userDataErrors.lastName">{{ userDataErrors.lastName }}</p>
          </div>
          <div class="form-field">
            <label for="username">Nazwa użytkownika</label>
            <InputText v-model="userData.username" id="username" type="text" placeholder="Jaca"/>
            <p class="u-error-msg" v-if="showUserDataErrors && userDataErrors.username">{{ userDataErrors.username }}</p>
          </div>
          <Button type="submit" :disabled="!isUserDataFormDirty">Zmień</Button>
        </div>
      </form>
    </template>
  </Card>

</template>
