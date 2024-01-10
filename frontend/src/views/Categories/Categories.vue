<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {categoriesService} from "@/api/services/categories";
import type {DefaultSortDetails} from "@/types/models/Sorting";
import {defaultSortDetails} from "@/helpers/SortHelpers";
import type {Category} from "@/types/models/Categories";

export default defineComponent({
  setup() {
    const sortDetails = ref<DefaultSortDetails>(defaultSortDetails);
    const searchText = ref('');
    const categories = ref<Category[]>();
    const fetchVendors = async (pageSize = 10, page = 1) => {
      try {
        const {data} = await categoriesService.getCategories(
            pageSize,
            page,
            sortDetails.value.parameter,
            sortDetails.value.order,
            searchText.value
        );
        categories.value = data.results;
      } catch (e) {
        console.log(e);
      }
    }
    onMounted(async () => {
      await fetchVendors();
    })
    return {
      categories
    }
  }
})
</script>

<template>
  <div>
    <h2>Kategorie:</h2>
    <div class="categories">
      <div class="category" v-for="category in categories">
        <p>
          {{ category.name }}
        </p>
        <p>
          {{ category.description }}
        </p>
      </div>
    </div>
  </div>
  Categories
</template>

<style scoped lang="scss">
div.categories {
  display: flex;
  justify-content: center;
  gap: 20px;
}

div.category {
  border-radius: 12px;
  padding: 10px;
  background-color: #ddd;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-basis: 25%;
}
</style>