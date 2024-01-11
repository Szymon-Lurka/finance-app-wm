<script lang="ts">
import {defineComponent, ref} from "vue";
import {useField, useForm} from "vee-validate";
import {object, ref as yupRef, string} from "yup";
import {useIsFormDirty} from "@/composables/isFormDirty";
import {userService} from "@/api/services/user";
import {PASSWORD_VALIDATION_REGEX} from "@/constants/regexes";
import {useToast} from "primevue/usetoast";
import {useToastsService} from "@/composables/toasts";
import {lang} from "@/constants/lang";

export default defineComponent({
  setup() {
    const showErrors = ref(false);
    const {dispatchErrorToast, dispatchSuccessToast} = useToastsService();
    const {
      values: passwordData,
      handleSubmit: handlePasswordSubmit,
      errors: passwordErrors,
      resetForm,
    } = useForm({
      validationSchema: object({
        currentPassword: string().required(lang.validation.nameRequired('Aktualne hasło')),
        newPassword: string().required('').matches(PASSWORD_VALIDATION_REGEX, lang.validation.password),
        repeatPassword: string()
            .oneOf([yupRef('newPassword'), null], lang.validation.repeatPassword).required()
      }),
      initialValues: {
        currentPassword: null,
        newPassword: null,
        repeatPassword: null
      }
    })

    const currentPassword = useField('currentPassword');
    const newPassword = useField('newPassword');
    const repeatPassword = useField('repeatPassword');
    const isFormDirty = useIsFormDirty([currentPassword, repeatPassword, newPassword]);
    const onSubmit = () => {
      showErrors.value = true;
      handlePasswordSubmit(async ({currentPassword, newPassword, repeatPassword}) => {
        try {
          await userService.updateUser({currentPassword, newPassword, repeatPassword});
          dispatchSuccessToast({title: lang.user.titles.updatePassword, details: lang.user.success.details.updatePassword})
          resetForm({
            values: {
              repeatPassword: null,
              newPassword: null,
              currentPassword: null,
            }
          })
          showErrors.value = false;
        } catch (e) {
          console.log(e);
          dispatchErrorToast({title: lang.user.titles.updatePassword, details: lang.user.error.details.updatePassword})
        }
      })();
    }
    return {
      onSubmit,
      passwordErrors,
      passwordData,
      isFormDirty,
      showErrors
    }
  }
})
</script>

<template>
  <Card class="card">
    <template #title>Zmień swoje hasło</template>
    <template #content>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <div class="form-field">
            <label for="currentPassword">Aktualne hasło</label>
            <InputText type="password" id="currentPassword" placeholder="Hasło" v-model="passwordData.currentPassword"/>
            <p class="u-error-msg" v-if="showErrors && passwordErrors.currentPassword">{{
                passwordErrors.currentPassword
              }}</p>
          </div>
          <div class="form-field">
            <label for="password">Hasło</label>
            <InputText type="password" id="password" placeholder="Hasło" v-model="passwordData.newPassword"/>
            <p class="u-error-msg" v-if="showErrors && passwordErrors.currentPassword">{{
                passwordErrors.newPassword
              }}</p>
          </div>
          <div class="form-field">
            <label for="repeatPassword">Powtórz hasło</label>
            <InputText id="repeatPassword" placeholder="Powtórzone hasło" type="password"
                       v-model="passwordData.repeatPassword"/>
            <p class="u-error-msg" v-if="showErrors && passwordErrors.repeatPassword">{{
                passwordErrors.repeatPassword
              }}</p>
          </div>
          <Button type="submit" :disabled="!isFormDirty">Zmień</Button>
        </div>
      </form>
    </template>
  </Card>

</template>
