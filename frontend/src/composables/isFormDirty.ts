import type { FieldContext } from 'vee-validate';
import { computed } from 'vue';

const useIsFormDirty = (fields: FieldContext[]) =>
    computed(() => fields.some((field) => field.meta.dirty));

export { useIsFormDirty };
