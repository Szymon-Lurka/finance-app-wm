<template>
  <div class="pagination">
    <button @click="changePage(-1)" :disabled="currentPage === 1">Poprzednia strona</button>
    <span>Strona {{ currentPage }} z {{ totalPages }}</span>
    <button @click="changePage(1)" :disabled="currentPage === totalPages">Następna strona</button>

    <select v-model="selectedItemsPerPage" @change="changeItemsPerPage">
      <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
        {{ option }} na stronie
      </option>
    </select>
  </div>
</template>

<script>
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
      default: () => [10, 20, 50], // Domyślne opcje ilości elementów na stronie
    },
  },
  data() {
    return {
      selectedItemsPerPage: this.itemsPerPage,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.selectedItemsPerPage);
    },
  },
  watch: {
    itemsPerPage(newVal) {
      this.selectedItemsPerPage = newVal;
    },
  },
  methods: {
    changePage(offset) {
      const newPage = this.currentPage + offset;
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.$emit('page-change', newPage);
      }
    },
    changeItemsPerPage() {
      this.$emit('items-per-page-change', this.selectedItemsPerPage);
    },
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