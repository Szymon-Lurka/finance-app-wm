<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {categoriesService} from "@/api/services/categories";
import type {DefaultSortDetails} from "@/types/models/Sorting";
import {defaultSortDetails} from "@/helpers/SortHelpers";
import type {Category} from "@/types/models/Categories";
import debounce from 'lodash.debounce';
import FormsCategory from "@/components/Forms/FormsCategory/FormsCategory.vue";
import {useToastsService} from "@/composables/toasts";
import {lang} from "@/constants/lang";
import {Pagination} from "@/types/models/Pagination";
import {defaultPagination} from "@/helpers/PaginationHelpers";
import AppPagination from "@/components/App/AppPagination/AppPagination.vue";

export default defineComponent({
  components: {AppPagination, FormsCategory},
  setup() {
    const {dispatchSuccessToast, dispatchErrorToast} = useToastsService();

    const sortDetails = ref<DefaultSortDetails>({...defaultSortDetails});
    const paginationDetails = ref<Pagination>({...defaultPagination});
    const searchText = ref('');
    const categories = ref<Category[]>();
    const categoriesTable = ref(null);
    const manageCategoryDialog = ref(false);
    const deleteCategoryDialog = ref(false);
    const selectedID = ref(null);
    const fetchCategories = async () => {
      try {
        const {data} = await categoriesService.getCategories(
            paginationDetails.value.pageSize,
            paginationDetails.value.page,
            sortDetails.value.parameter,
            sortDetails.value.order,
            searchText.value
        );
        categories.value = data.results;
        paginationDetails.value.page = data.currentPage;
        paginationDetails.value.totalCount = data.totalCount;
        paginationDetails.value.totalPages = data.totalPages;
      } catch (e) {
        console.log(e);
      }
    }
    const onDeleteCategory = (id: string) => {
      deleteCategoryDialog.value = true;
      selectedID.value = id;
    };
    const openNew = () => {
      selectedID.value = null;
      manageCategoryDialog.value = true;
    };
    const onSort = (sortEvent) => {
      sortDetails.value.order = sortEvent.sortOrder;
      sortDetails.value.parameter = sortEvent.sortField;
      fetchCategories();
    }

    const onPageChange = (page: number) => {
      paginationDetails.value.page = page;
      fetchCategories();
    }

    const onItemsOnPageChange = (pageSize: number) => {
      paginationDetails.value.pageSize = pageSize;
      fetchCategories();
    }

    const editCategory = (id: string) => {
      manageCategoryDialog.value = true;
      selectedID.value = id;
    }

    const refresh = () => {
      manageCategoryDialog.value = false;
      selectedID.value = null;
      fetchCategories();
    }

    const searchCategories = debounce(async () => {
      await fetchCategories();
    }, 500);

    const refuseToDelete = () => {
      deleteCategoryDialog.value = false;
      selectedID.value = false;
    }

    const deleteCategory = async () => {
      deleteCategoryDialog.value = false;
      try {
        await categoriesService.deleteCategory(selectedID.value);
        await fetchCategories();
        dispatchSuccessToast({title: lang.categories.titles.deleting, details: lang.categories.success.details.deleting});
      } catch (e) {
        dispatchErrorToast({title: lang.categories.titles.deleting, details: lang.categories.error.details.deleting});
      }
    }

    onMounted(async () => {
      await fetchCategories();
    })

    return {
      categories,
      categoriesTable,
      onSort,
      searchText,
      searchCategories,
      openNew,
      refresh,
      editCategory,
      selectedID,
      manageCategoryDialog,
      deleteCategoryDialog,
      deleteCategory,
      refuseToDelete,
      onDeleteCategory,
      paginationDetails,
      onPageChange,
      onItemsOnPageChange
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
            <Button label="Nowa" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew"/>
          </template>
        </Toolbar>
        <DataTable ref="categoriesTable" :value="categories" dataKey="id" :rows="10"
                   @sort="onSort">
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
          <Column field="color" header="Kolor" style="width:10%">
            <template #body="{data}"><span class="round" :style="{'background-color': data.color}"/></template>
          </Column>
          <Column header="Akcje" style="width:10%">
            <template #body="{data}">
              <div class="actions">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(data._id)"/>
                <Button icon="pi pi-trash" outlined rounded class="mr-2" @click="onDeleteCategory(data._id)"/>
              </div>
            </template>
          </Column>
          <template #footer>
            <AppPagination :total-items="paginationDetails.totalCount"
                           :items-per-page="paginationDetails.pageSize"
                           :items-per-page-options="[5,10,15]"
                           :current-page="paginationDetails.page"
                           @page-change="onPageChange"
                           @items-per-page-change="onItemsOnPageChange"/>
          </template>
        </DataTable>
      </div>
      <Dialog close-on-escape v-model:visible="manageCategoryDialog"
              :header="`${!!selectedID ? 'Edycja' : 'Dodawanie'} kategorii`"
              :modal="true" style="width:450px;">
        <FormsCategory @changed="refresh" :id="selectedID"/>
      </Dialog>
      <Dialog v-model:visible="deleteCategoryDialog" header="Usuwanie kategorii">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3"/>
          <span>Na pewno chcesz usunąć kategorie?</span>
        </div>
        <template #footer>
          <Button label="Nie" icon="pi pi-times" text @click="refuseToDelete"/>
          <Button label="Tak" icon="pi pi-check" text @click="deleteCategory"/>
        </template>
      </Dialog>
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

.actions {
  display: flex;
}
</style>