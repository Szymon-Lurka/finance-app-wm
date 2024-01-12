<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {raportsService} from '@/api/services/raports';
import dayjs from "dayjs";
import {formatAmount} from "@/helpers/formatAmount";

export default defineComponent({
  setup() {
    const totalAmount = ref(0);
    const totalExpensesAmount = ref(0);
    const totalIncomesAmount = ref(0);
    const entries = ref([]);
    const diffEntries = ref({});
    const categoriesTotalIncomeExpense = ref({});
    const categoriesExpenseIncome = ref([]);
    const categoriesDates = ref({});
    const categoriesAmounts = ref({});

    const prepareDiffEntries = (dEntries) => {
      const incomeEntry = dEntries.filter((entry) => entry._id === 'income')?.[0] || {totalAmount: 0};
      const expanseEntry = dEntries.filter((entry) => entry._id === 'expense')?.[0] || {totalAmount: 0};
      const totalSum = dEntries.reduce((sum, entry) => sum + Math.abs(entry.totalAmount), 0);
      return {
        labels: ['Przychody', 'Wydatki'],
        datasets: [
          {
            data: [Math.round(Math.abs(incomeEntry.totalAmount / totalSum) * 100), Math.round(Math.abs(expanseEntry.totalAmount / totalSum) * 100)],
            backgroundColor: ['#3fba8d', '#c44755']
          }
        ]
      }
    };

    const prepareCategoriesTotalIncomeExpense = (cEntries) => {
      return {
        labels: cEntries.map((entry) => entry._id),
        datasets: [
          {
            label: 'Przychody',
            data: cEntries.map((entry) => entry.totalIncome.toFixed(2)),
            backgroundColor: ['#3fba8d']
          },
          {
            label: 'Wydatki',
            data: cEntries.map((entry) => entry.totalExpense.toFixed(2)),
            backgroundColor: ['#c44755']
          }
        ]
      }
    }
    const prepareCategoriesDates = (cEntries) => {
      const categories = [...new Set(cEntries.map((entry) => entry._id.category))];
      const dates = [...new Set(cEntries.map((entry) => entry._id.date))];
      // @ts-ignore
      dates.sort((a, b) => new Date(a) - new Date(b));
      const datasets = [];

      categories.forEach((category) => {
        const dataPoints = dates.map((date) => {
          const entry = cEntries.find((d) => d._id.date === date && d._id.category === category);
          return entry ? entry.totalAmount : 0;
        });
        datasets.push({
          label: category,
          backgroundColor: cEntries.find((d) => d._id.category === category)?._id.color,
          data: dataPoints
        })
      })

      return {
        //@ts-ignore
        labels: dates.map((date) => dayjs(date).format('MM/DD/YYYY')),
        datasets
      }
    }
    const prepareCategoriesAmount = (cEntries) => {
      const totalSum = cEntries.reduce((sum, entry) => sum + Math.abs(entry.totalAmount), 0);

      const datasets = [{
        data: cEntries.map((entry) => Math.round(Math.abs(entry.totalAmount / totalSum) * 100)),
        backgroundColor: cEntries.map((entry) => entry._id.color)
      }];

      const chartData = {
        labels: cEntries.map((entry) => entry._id.category),
        datasets
      }

      return chartData;
    }

    const percentageOptions = {
      aspectRatio: 1,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              return `${value}%`
            }
          }
        }
      }
    };

    const currencyOptions = {
      aspectRatio: 1,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              return `${formatAmount(value.y)} PLN`
            }
          }
        }
      }
    };

    const fetchBalance = async () => {
      try {
        const {data} = await raportsService.getBalance();
        totalAmount.value = data.totalAmount;
        entries.value = data.entries;
        diffEntries.value = prepareDiffEntries(data.diffEntries || []);
        totalExpensesAmount.value = data.diffEntries.find((entry) => entry._id === 'expense')?.totalAmount || 0;
        totalIncomesAmount.value = data.diffEntries.find((entry) => entry._id === 'income')?.totalAmount || 0;
        categoriesTotalIncomeExpense.value = prepareCategoriesTotalIncomeExpense(data.categoriesTotalIncomeExpense || []);
        categoriesExpenseIncome.value = data.categoriesExpenseIncome;
        categoriesDates.value = prepareCategoriesDates(data.categoriesDates || []);
        categoriesAmounts.value = prepareCategoriesAmount(data.categoriesAmounts || []);
        console.log(categoriesTotalIncomeExpense.value);
      } catch (e) {
        console.log(e);
      }
    };

    onMounted(async () => {
      await fetchBalance();
    });
    return {
      totalAmount,
      diffEntries,
      categoriesTotalIncomeExpense,
      categoriesDates,
      categoriesAmounts,
      percentageOptions,
      currencyOptions,
      formatAmount,
      totalExpensesAmount,
      totalIncomesAmount
    };
  },
});
</script>

<template>
  <div class="grid">
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">Bilans</span>
            <div class="text-900 font-medium text-xl"
                 :style="{'color': totalAmount > 0 ? '#3fba8d !important' : '#c44755 !important'}">
              {{ formatAmount(totalAmount) }} zł
            </div>
          </div>
          <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round"
              style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">Wydatki</span>
            <div class="text-900 font-medium text-xl" :style="{'color': '#c44755 !important'}">
              {{ formatAmount(Math.abs(totalExpensesAmount)) }} zł
            </div>
          </div>
          <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round"
              style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">Przychody</span>
            <div class="text-900 font-medium text-xl" :style="{'color': '#3fba8d !important'}">{{
                formatAmount(Math.abs(totalIncomesAmount))
              }} zł
            </div>
          </div>
          <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round"
              style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">whatever</span>
            <div class="text-900 font-medium text-xl">XYZ</div>
          </div>
          <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round"
              style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl"/>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-6">
      <div class="card card-chart">
        <h2>Dochody</h2>
        <Chart type="pie" :data="diffEntries" :options="percentageOptions"/>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-6">
      <div class="card card-chart">
        <h2>Dochody w kategoriach</h2>
        <Chart type="pie" :data="categoriesAmounts" :options="percentageOptions"/>
      </div>
    </div>

    <div class="col-12 xl:col-12">
      <div class="card card-chart">
        <h2>Bilans kategorii</h2>
        <Chart type="bar" :data="categoriesTotalIncomeExpense" style="width: 100%; height:500px;" :options="currencyOptions"/>
      </div>
      <div class="card card-chart">
        <h2>Bilans kategorii według daty</h2>
        <Chart type="bar" :data="categoriesDates" style="width: 100%; height:500px;" :options="currencyOptions"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-chart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>