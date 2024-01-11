<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {categoriesService} from "@/api/services/categories";
import type {DefaultSortDetails} from "@/types/models/Sorting";
import {defaultSortDetails} from "@/helpers/SortHelpers";
import type {Category} from "@/types/models/Categories";
import debounce from 'lodash.debounce';

export default defineComponent({
  setup() {
    const sortDetails = ref<DefaultSortDetails>(defaultSortDetails);
    const paginationDetails = ref({
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      inRow: 0,
    });
    const searchText = ref('');
    const categories = ref<Category[]>();
    const categoriesTable = ref(null);
    const fetchCategories = async (pageSize = 10, page = 1) => {
      try {
        const {data} = await categoriesService.getCategories(
            pageSize,
            page,
            sortDetails.value.parameter,
            sortDetails.value.order,
            searchText.value
        );
        console.log(data);
        paginationDetails.value = {
          currentPage: data.currentPage,
          totalCount: data.totalCount,
          inRow: data.totalCount,
          totalPages: data.totalPages * data.totalCount
        }
        categories.value = data.results;
      } catch (e) {
        console.log(e);
      }
    }
    onMounted(async () => {
      await fetchCategories();
    })
    const onSort = (sortEvent) => {
      sortDetails.value.order = sortEvent.sortOrder;
      sortDetails.value.parameter = sortEvent.sortField;
      fetchCategories();
    }

    const onPagination = (x) => {
        console.log(x);
  }

    const searchCategories = debounce(async () => {
      await fetchCategories();
    }, 500);
    return {
      categories,
      categoriesTable,
      onSort,
      searchText,
      searchCategories,
      paginationDetails,
      onPagination,
    }
  }
})
</script>

<template>
  <div>
    <div>
      <div class="card">
        <Toolbar class="mb-4">
          <template #start>
            <Button label="Nowa" icon="pi pi-plus" severity="success" class="mr-2"/>
          </template>
        </Toolbar>
        <DataTable lazy ref="categoriesTable" :value="categories" dataKey="id" :rows="10"
                   :rows-per-page-options="[2,5,10,20,50]"
                   :filters="filters" @sort="onSort">
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
              <i class="pi pi-search"/>
                <InputText v-model="searchText" placeholder="Szukaj" @input="searchCategories"/>
            </span>
            </div>
          </template>
          <template #empty>Brak kategorii</template>
          <Column field="name" header="Nazwa" sortable style="width: 25%"/>
          <Column field="description" header="Opis" sortable/>
          <Column field="color" header="Kolor" sortable style="width:10%">
            <template #body="{data}"><span class="round" :style="{'background-color': data.color}"/></template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

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

.round {
  width: 15px;
  height: 15px;
  display: inline-block;
  border-radius: 50%;
}
</style>