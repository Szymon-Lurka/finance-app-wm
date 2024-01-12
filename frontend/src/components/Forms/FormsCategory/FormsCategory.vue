<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useIsFormDirty} from "@/composables/isFormDirty";
import {categoriesService} from "@/api/services/categories";
import {lang} from "@/constants/lang";
import {useToastsService} from "@/composables/toasts";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: false
    }
  },
  emits: ['changed'],
  setup(props, {emit}) {
    const {dispatchSuccessToast, dispatchErrorToast} = useToastsService();

    const showErrors = ref(false);

    const isEditing = !!props.id;
    const getProperFieldName = () => isEditing ? 'edit' : 'add';

    const {
      values,
      handleSubmit,
      errors,
      resetForm
    } = useForm({
      validationSchema: object({
        name: string().required(lang.validation.nameRequired('Nazwa')).min(3, lang.validation.min(3, 'Nazwa')),
        description: string().max(125, lang.validation.max(125, 'Opis')),
        color: string().required(lang.validation.nameRequired('Kolor'))
      }),
      initialValues: {
        name: '',
        description: '',
        color: '#000000'
      }
    })

    const name = useField('name');
    const description = useField('description');
    const color = useField('color');

    const isFormDirty = useIsFormDirty([name, description, color]);

    const fetchCategory = async () => {
      try {
        const {data} = await categoriesService.getCategory(props.id);
        const {name, description, color} = data.category;
        resetForm({
          values: {
            name,
            description,
            color
          }
        })
        console.log(data);
      } catch (e) {
        dispatchErrorToast({title: lang.categories.titles.edit, details: lang.categories.error.details.editFetch});
      }
    };
    const onSubmit = () => {
      showErrors.value = true;
      handleSubmit(async ({name, description, color}) => {
        try {
          const payload = {name, description, color: `#${color}`};
          if (isEditing) {
            await categoriesService.editCategory(props.id, payload);
          } else {
            await categoriesService.addCategory(payload);
          }
          emit('changed');
          dispatchSuccessToast({title: lang.categories.titles[getProperFieldName()], timeMS: 3000, details: lang.categories.success.details[getProperFieldName()]})
        } catch (e) {
          console.log(e);
          if (e.response.data?.isDuplicates) {
            dispatchErrorToast({title: lang.categories.titles[getProperFieldName()], details: lang.categories.error.details.exists})
          } else {
            dispatchErrorToast({title: lang.categories.titles[getProperFieldName()], details: lang.categories.error.details[getProperFieldName()]})
          }
        }
      })()
    }

    onMounted(async () => {
      console.log(props.id);
      if (isEditing) await fetchCategory();
    })

    return {
      onSubmit,
      errors,
      values,
      showErrors,
      isFormDirty,
      isEditing
    }
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="form">
    <div class="form-group">
      <div class="form-field flex">
        <label for="name">Nazwa</label>
        <InputText type="text" v-model="values.name" name="name" id="name"/>
        <p class="u-error-msg" v-if="showErrors && errors.name">{{ errors.name }}</p>
      </div>
      <div class="form-field flex">
        <label for="description">Opis</label>
        <Textarea v-model="values.description" name="description" id="description"/>
        <p class="u-error-msg" v-if="showErrors && errors.description">{{ errors.description }}</p>
      </div>
      <div class="form-field flex">
        <label for="color">Kolor</label>
        <ColorPicker v-model="values.color" inline/>
      </div>
      <Button type="submit" :disabled="!isFormDirty">{{ isEditing ? 'Edytuj' : 'Dodaj' }}</Button>
    </div>
  </form>
</template>

<style lang="scss">

</style>