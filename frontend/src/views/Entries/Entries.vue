<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {financialEntriesService} from "@/api/services/financialEntries";
import {DefaultSortDetails} from "@/types/models/Sorting";
import {defaultSortDetails} from "@/helpers/SortHelpers";
import type {Entry} from "@/types/models/FinancialEntries";
import debounce from 'lodash.debounce';
import {lang} from "@/constants/lang";
import FormsCategory from "@/components/Forms/FormsCategory/FormsCategory.vue";
import {useToastsService} from "@/composables/toasts";
import {useUserStore} from "@/stores/userStore";
import type {Category} from "@/types/models/Categories";
import FormsEntry from "@/components/Forms/FormsEntry/FormsEntry.vue";
import dayjs from "dayjs";

export default defineComponent({
  components: {FormsEntry, FormsCategory},
  setup() {
    const {dispatchSuccessToast, dispatchErrorToast} = useToastsService();
    const userStore = useUserStore();

    const sortDetails = ref<DefaultSortDetails>(defaultSortDetails);
    const category = ref<Category>();
    const searchText = ref('');
    const financialEntries = ref<Entry[]>([]);
    const totalAmount = ref(0);
    const selectedID = ref(null);
    const manageEntryDialog = ref(false);
    const deleteEntryDialog = ref(false);
    const fetchFinancialEntries = async (fetchBalance = true, pageSize = 10, page = 1) => {
      try {
        await userStore.fetchBalance();
        const {data} = await financialEntriesService.getFinancialEntries(
            pageSize,
            page,
            sortDetails.value.parameter,
            sortDetails.value.order,
            searchText.value
        );
        financialEntries.value = data.results;
        totalAmount.value = data.totalAmount;
      } catch (e) {
        console.log(e);
      }
    }
    onMounted(async () => {
      await fetchFinancialEntries(false);
    })

    const onSort = (sortEvent) => {
      sortDetails.value.order = sortEvent.sortOrder;
      sortDetails.value.parameter = sortEvent.sortField;
      fetchFinancialEntries();
    }

    const editEntry = (id: string) => {
      manageEntryDialog.value = true;
      selectedID.value = id;
    }

    const refresh = () => {
      manageEntryDialog.value = false;
      selectedID.value = null;
      fetchFinancialEntries();
    }

    const searchEntries = debounce(async () => {
      await fetchFinancialEntries();
    }, 500);
    const onDeleteEntry = (id: string) => {
      deleteEntryDialog.value = true;
      selectedID.value = id;
    };

    const refuseToDelete = () => {
      deleteEntryDialog.value = false;
      selectedID.value = false;
    }

    const deleteEntry = async () => {
      deleteEntryDialog.value = false;
      try {
        await financialEntriesService.deleteEntry(selectedID.value);
        await fetchFinancialEntries();
        dispatchSuccessToast({title: lang.entries.titles.deleting, details: lang.entries.success.details.deleting});
      } catch (e) {
        dispatchErrorToast({title: lang.entries.titles.deleting, details: lang.entries.error.details.deleting});
      }
    }
    const openNew = () => {
      selectedID.value = null;
      manageEntryDialog.value = true;
    };

    return {
      searchText,
      financialEntries,
      totalAmount,
      selectedID,
      manageEntryDialog,
      deleteEntryDialog,
      onSort,
      openNew,
      refresh,
      editEntry,
      deleteEntry,
      refuseToDelete,
      onDeleteEntry,
      searchEntries,
      dayjs
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
            <Button label="Nowy wpis" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew"/>
          </template>
        </Toolbar>
        <DataTable :value="financialEntries" @sort="onSort">
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
              <i class="pi pi-search"/>
                <InputText v-model="searchText" placeholder="Szukaj" @input="searchEntries"/>
            </span>
            </div>
          </template>
          <template #empty>Brak wpisów</template>
          <Column header="Typ">
            <template #body="{data}">
              <badge :severity="data.type === 'expense' ? 'danger' : 'success'">
                {{ data.type === 'expense' ? 'Wydatek' : 'Przychód' }}
              </badge>
            </template>
          </Column>
          <Column sortable field="date" header="Data">
            <template #body="{data}">
              {{ dayjs(data.date).format('MM/DD/YYYY') }}
            </template>
          </Column>

          <Column field="name" header="Nazwa" sortable style="width: 25%"/>
          <Column field="description" header="Opis" sortable style="width:25%; max-width:25%"/>
          <Column header="Kwota" sortable>
            <template #body="{data}">
              <badge :severity="data.amount > 0 ? 'success' : 'danger'">
                {{ data.amount }} zł
              </badge>
            </template>
          </Column>
          <Column header="Kategoria" sortable style="width:20%">
            <template #body="{data}">
              <badge v-if="data.categories" :style="{'background-color': data.categories.color}">
                {{ data.categories.name }}
              </badge>
              <badge v-else>BRAK KATEGORII</badge>
            </template>
          </Column>
          <Column header="Akcje" style="width:10%">
            <template #body="{data}">
              <div class="actions">
                <div class="flex">
                  <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editEntry(data._id)"/>
                  <Button icon="pi pi-trash" outlined rounded class="mr-2" @click="onDeleteEntry(data._id)"/>
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
        <Dialog close-on-escape v-model:visible="manageEntryDialog"
                :header="`${!!selectedID ? 'Edycja' : 'Dodawanie'} wpisu`"
                :modal="true" style="width:600px;">
          <FormsEntry :id="selectedID" @changed="refresh"/>
        </Dialog>
        <Dialog v-model:visible="deleteEntryDialog" header="Usuwanie wpisu">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3"/>
            <span>Na pewno chcesz usunąć wpis?</span>
          </div>
          <template #footer>
            <Button label="Nie" icon="pi pi-times" text @click="refuseToDelete"/>
            <Button label="Tak" icon="pi pi-check" text @click="deleteEntry"/>
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flex {
  display: flex;
}
</style>