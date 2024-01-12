<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {useField, useForm} from "vee-validate";
import {number, object, string} from "yup";
import {useIsFormDirty} from "@/composables/isFormDirty";
import {categoriesService} from "@/api/services/categories";
import {lang} from "@/constants/lang";
import {useToastsService} from "@/composables/toasts";
import {financialEntriesService} from "@/api/services/financialEntries";
import dayjs from "dayjs";
import type {Category} from "@/types/models/Categories";
import {deleteUntouchedFields} from "@/helpers/deleteUntouchedFields";

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
    const categoryIdRef = ref(null);
    const categorySelectRef = ref(null);


    const isEditing = !!props.id;
    const getProperFieldName = () => isEditing ? 'edit' : 'add';

    const {
      values,
      handleSubmit,
      errors,
      resetForm
    } = useForm({
      validationSchema: object({
        name: string().required(lang.validation.nameRequired('Nazwa')).min(3, lang.validation.min(3, 'Nazwa')).max(30, lang.validation.max(30, 'Nazwa')),
        description: string().max(125, lang.validation.max(125, 'Opis')),
        type: string().oneOf(['expense', 'income'], 'xD'),
        amount: number(),
        date: string().required(lang.validation.nameRequired('Data')),
      }),
      initialValues: {
        name: '',
        description: '',
        type: 'expense',
        amount: 0,
        date: null
      }
    })

    const name = useField('name');
    const description = useField('description');
    const type = useField('type');
    const amount = useField('amount');
    const categoryId = useField('categoryId');
    const date = useField('date');

    const fields = [name, description, type, amount, categoryId, date];

    const isFormDirty = useIsFormDirty(fields);
    const isCategorySelectDirty = ref(false);
    watch(categoryIdRef, (x) => {
      isCategorySelectDirty.value = true;
    });

    const setWatch = () => {
      watch(categorySelectRef, (categoryName) => {
        categoryIdRef.value = categories.value.find((cat) => cat.name === categoryName).id;
      })
    }

    const fetchEntry = async () => {
      try {
        const {data} = await financialEntriesService.getEntry(props.id);
        if (data.entry.length > 0) {
          const {amount, date, description, name, type} = data.entry[0];
          const category = data.entry[0]?.categories;
          categorySelectRef.value = (category && category.name) ?? null;
          resetForm({
            values: {
              name,
              description,
              date: dayjs(date).format('MM/DD/YYYY'),
              amount,
              type
            }
          })
        } else {
          throw new Error();
        }
      } catch (e) {
        dispatchErrorToast({title: lang.entries.titles.edit, details: lang.entries.error.details.editFetch});
      }
    };

    const categories = ref<{ color: string; name: string; id: string }[]>([])
    const fetchCategories = async () => {
      try {
        const {data} = await categoriesService.getAllCategories();
        categories.value = data.results.map((result) => ({
          color: result.color,
          name: result.name,
          id: result._id
        }));
      } catch (e) {
        console.log(e);
      }
    }
    const onSubmit = () => {
      showErrors.value = true;
      handleSubmit(async ({name, description, date, type, amount}) => {
        try {
          const payload = {name, description, date: dayjs(date).toISOString(), type, amount};
          deleteUntouchedFields(payload, fields);
          let goodPayload: {
            name: string;
            description: string;
            date: string;
            type: string;
            amount: number;
            categoryId?: string;
          } = {...payload};
          if (isCategorySelectDirty.value) {
            goodPayload = {...goodPayload, categoryId: categoryIdRef.value}
          }
          if (isEditing) {
            await financialEntriesService.editEntry(props.id, goodPayload);
          } else {
            await financialEntriesService.addEntry(goodPayload);
          }
          emit('changed');
          dispatchSuccessToast({
            title: lang.entries.titles[getProperFieldName()],
            details: lang.entries.success.details[getProperFieldName()]
          })
        } catch (e) {
          console.log(e);
          if (e.response.data?.isDuplicates) {
            dispatchErrorToast({
              title: lang.entries.titles[getProperFieldName()],
              details: lang.entries.error.details.exists
            })
          } else {
            dispatchErrorToast({
              title: lang.entries.titles[getProperFieldName()],
              details: lang.entries.error.details[getProperFieldName()]
            })
          }
        }
      })()
    }

    onMounted(async () => {
      await fetchCategories();
      if (isEditing) await fetchEntry();
      setWatch();
    })

    return {
      onSubmit,
      errors,
      values,
      showErrors,
      isFormDirty,
      isEditing,
      categories,
      categorySelectRef,
      isCategorySelectDirty
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
      <div class="form-field container">
        <div>
          <label for="date">Data</label>
          <Calendar showIcon icon-display="input" inputId="icondisplay" v-model="values.date" name="date" id="date"/>
          <p class="u-error-msg" v-if="showErrors && errors.date">{{ errors.date }}</p>
        </div>

        <div>
          <label for="amount">Kwota</label>
          <InputNumber inputId="minmaxfraction" :min-fraction-digits="0" :max-fraction-digits="2"
                       v-model="values.amount"
                       name="amount" id="amount"/>
          <p class="u-error-msg" v-if="showErrors && errors.amount">{{ errors.amount }}</p>
        </div>
      </div>
      <div class="form-field flex">

      </div>
      <div class="form-field radio-container">
        <div class="radio">
          <label for="expense">Wydatek</label>
          <RadioButton v-model="values.type" inputId="expense" name="expense" value="expense"/>
        </div>
        <div class="radio">
          <label for="income">Przychód</label>
          <RadioButton v-model="values.type" inputId="income" name="income" value="income"/>
        </div>
      </div>
      <div class="form-field flex">
        <label for="category">Kategoria</label>
        <Dropdown v-model="categorySelectRef" :options="categories.map((cat) => cat.name)" inputId="category"/>
      </div>
      <Button type="submit" :disabled="isCategorySelectDirty ? false : !isFormDirty">{{
          isEditing ? 'Edytuj' : 'Dodaj'
        }}
      </Button>
    </div>
  </form>
</template>

<style lang="scss">
.radio {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &-container {
    display: flex;
    gap: 30px;
  }
}

.container {
  display: flex;
  width: 100%;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.flex {
  display: flex;
}
</style>