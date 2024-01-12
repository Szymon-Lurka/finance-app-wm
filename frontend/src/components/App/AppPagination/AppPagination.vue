<template>
  <div class="pagination">
    <Button icon="pi pi-chevron-left" outlined rounded class="mr-2" @click="changePage(-1)"
            :disabled="currentPage === 1"/>
    <span>Strona {{ currentPage }} z {{ totalPages }}</span>
    <Button icon="pi pi-chevron-right" outlined rounded class="mr-2" @click="changePage(1)"
            :disabled="currentPage === totalPages"/>

    <Dropdown v-model="selectedItemsPerPage" :options="itemsPerPageOptions" @change="changeItemsPerPage"
    />

  </div>
</template>

<script>
import {ref, computed, watch} from 'vue';

export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [5, 10, 15],
    },
  },
  setup(props, {emit}) {
    const selectedItemsPerPage = ref(props.itemsPerPage);

    const totalPages = computed(() => Math.ceil(props.totalItems / selectedItemsPerPage.value));

    watch(() => props.itemsPerPage, (newVal) => {
      selectedItemsPerPage.value = newVal;
    });

    const changePage = (offset) => {
      const newPage = props.currentPage + offset;
      if (newPage >= 1 && newPage <= totalPages.value) {
        emit('page-change', newPage);
      }
    };

    const changeItemsPerPage = () => {
      emit('items-per-page-change', selectedItemsPerPage.value);
    };

    return {
      selectedItemsPerPage,
      totalPages,
      changePage,
      changeItemsPerPage
    };
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

button {
  cursor: pointer;
}
</style>
