<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref, watch} from 'vue';
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
    const categoriesExpenseIncome = ref(
        {
          incomes: {
            labels: []
          },
          expenses: {
            labels: []
          },
          expansesBar: {
            labels: []
          },
          incomesBar: {
            labels: []
          }
        }
    );
    const categoriesDates = ref({});
    const categoriesAmounts = ref({});
    const dateFrom = ref(dayjs().subtract(7, 'd').format('MM/DD/YYYY'));
    const dateTo = ref(dayjs().format('MM/DD/YYYY'));
    const dateToError = ref('');
    const dateFromError = ref('');

    const categoryIncomeExists = computed(() => categoriesExpenseIncome.value.incomes.labels.length > 0);
    const categoryExpenseExists = computed(() => categoriesExpenseIncome.value.expenses.labels.length > 0);

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

    const prepareCategoriesExpenseIncome = (cEntries) => {
      const incomeEntries = cEntries.filter((entry) => entry._id.type === 'income');
      const expanseEntries = cEntries.filter((entry) => entry._id.type === 'expense');
      const totalSumExpense = expanseEntries.reduce((sum, entry) => sum + Math.abs(entry.totalAmount), 0);
      const totalSumIncome = incomeEntries.reduce((sum, entry) => sum + Math.abs(entry.totalAmount), 0);

      const incomeDatasets = [{data: [], backgroundColor: []}];
      incomeEntries.forEach((entry) => {
        incomeDatasets[0].data.push(Math.round(Math.abs(entry.totalAmount / totalSumExpense) * 100)),
            incomeDatasets[0].backgroundColor.push(entry._id.color)
      })

      const expanseDatasets = [{data: [], backgroundColor: []}];
      expanseEntries.forEach((entry) => {
        expanseDatasets[0].data.push(Math.round(Math.abs(entry.totalAmount / totalSumExpense) * 100)),
            expanseDatasets[0].backgroundColor.push(entry._id.color)
      })

      const expensesBarDataset = [{
        label: 'Wydatki',
        data: expanseEntries.map((entry) => entry.totalAmount),
        backgroundColor: expanseEntries.map((entry) => entry._id.color)
      }]

      const incomeBarDataset = [{
        label: 'Przychody',
        data: incomeEntries.map((entry) => entry.totalAmount),
        backgroundColor: incomeEntries.map((entry) => entry._id.color)
      }]

      return {
        incomes: {
          labels: incomeEntries.map((entry) => entry._id.category),
          datasets: incomeDatasets
        },
        expenses: {
          labels: expanseEntries.map((entry) => entry._id.category),
          datasets: expanseDatasets
        },
        expansesBar: {
          labels: expanseEntries.map((entry) => entry._id.category),
          datasets: expensesBarDataset
        },
        incomesBar: {
          labels: incomeEntries.map((entry) => entry._id.category),
          datasets: incomeBarDataset
        }
      }
    };
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
              const label = context.dataset.label || '';
              return `${label}: ${formatAmount(value.y)} PLN`
            }
          }
        }
      }
    };

    const stackedCurrencyOptions = {
      ...currencyOptions,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    }

    const params = reactive({
      dateFrom: dayjs().subtract(7, 'd').toISOString(),
      dateTo: dayjs().toISOString()
    });

    const fetchBalance = async () => {
      try {
        const {data} = await raportsService.getBalance(params);
        totalAmount.value = data.totalAmount;
        entries.value = data.entries;
        diffEntries.value = prepareDiffEntries(data.diffEntries || []);
        totalExpensesAmount.value = data.diffEntries.find((entry) => entry._id === 'expense')?.totalAmount || 0;
        totalIncomesAmount.value = data.diffEntries.find((entry) => entry._id === 'income')?.totalAmount || 0;
        categoriesTotalIncomeExpense.value = prepareCategoriesTotalIncomeExpense(data.categoriesTotalIncomeExpense || []);
        categoriesExpenseIncome.value = prepareCategoriesExpenseIncome(data.categoriesExpenseIncome || []);
        categoriesDates.value = prepareCategoriesDates(data.categoriesDates || []);
        categoriesAmounts.value = prepareCategoriesAmount(data.categoriesAmounts || []);
      } catch (e) {
        console.log(e);
      }
    };

    onMounted(async () => {
      await fetchBalance();
    });

    watch(params, async () => {
      await fetchBalance();
    })


    const setDatesErrors = () => {
      dateToError.value = 'Data końcowa musi być późniejsza lub taka sama jak data początkowa';
      dateFromError.value = 'Data początkowa musi być wcześniejsza lub taka sama jak data końcowa';
    }

    const resetDatesErrors = () => {
      dateFromError.value = '';
      dateToError.value = '';
    }

    watch(dateTo, (from) => {
      if (dayjs(from).diff(dayjs(dateFrom.value)) < 0) {
        setDatesErrors();
      } else {
        params.dateTo = dayjs(from).toISOString();
        resetDatesErrors();
      }
    })

    watch(dateFrom, (from) => {
      if (dayjs(from).diff(dayjs(dateTo.value)) > 0) {
        setDatesErrors();
      } else {
        params.dateFrom = dayjs(from).toISOString();
        resetDatesErrors();
      }
    })

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
      totalIncomesAmount,
      dateTo,
      dateFrom,
      dateToError,
      dateFromError,
      categoriesExpenseIncome,
      categoryIncomeExists,
      categoryExpenseExists,
      stackedCurrencyOptions,
    };
  },
});
</script>

<template>
  <div class="grid">
    <div class="col-12 lg:col-6 xl:col-6">
      <div class="card mb-0">
        <date class="form-field container">
          <label for="date">Data początkowa</label>
          <Calendar showIcon icon-display="input" inputId="icondisplay" v-model="dateFrom" name="date" id="date"/>
          <p class="u-error-msg" v-if="dateFromError"> {{ dateFromError }}</p>
        </date>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-6">
      <div class="card mb-0">
        <div class="form-field container">
          <label for="date">Data końcowa</label>
          <Calendar showIcon icon-display="input" inputId="icondisplay" v-model="dateTo" name="date" id="date"/>
          <p class="u-error-msg" v-if="dateToError"> {{ dateToError }}</p>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-4">
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
    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">Przychody</span>
            <div class="text-900 font-medium text-xl" :style="{'color': '#3fba8d !important'}">{{
                formatAmount(Math.abs(totalIncomesAmount).toFixed(2))
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
    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">Wydatki</span>
            <div class="text-900 font-medium text-xl" :style="{'color': '#c44755 !important'}">
              {{ formatAmount(Math.abs(totalExpensesAmount).toFixed(2)) }} zł
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
    <div class="col-12" :class="{
      'lg:col-4': categoryIncomeExists && categoryExpenseExists,
      'xl:col-4': categoryIncomeExists && categoryExpenseExists,
      'lg:col-8': !categoryIncomeExists && categoryExpenseExists || categoryIncomeExists && !categoryExpenseExists,
      'xl:col-8': !categoryIncomeExists && categoryExpenseExists || categoryIncomeExists && !categoryExpenseExists,
      'lg:col-12': !categoryIncomeExists && !categoryExpenseExists,
      'xl:col-12': !categoryIncomeExists && !categoryExpenseExists,
    }">
      <div class="card card-chart">
        <h2>Bilans całościowy</h2>
        <Chart type="pie" :data="diffEntries" :options="percentageOptions"/>
      </div>
    </div>
    <div class="col-12 lg:col-4 xl:col-4" v-if="categoryIncomeExists">
      <div class="card card-chart">
        <h2>Bilans przychodów</h2>
        <Chart type="pie" :data="categoriesExpenseIncome.incomes" :options="percentageOptions"/>
      </div>
    </div>
    <div class="col-12 lg:col-4 xl:col-4" v-if="categoryExpenseExists">
      <div class="card card-chart">
        <h2>Bilans wydatków</h2>
        <Chart type="pie" :data="categoriesExpenseIncome.expenses" :options="percentageOptions"/>
      </div>
    </div>
    <div class="col-12 xl:col-12">
      <div class="card card-chart">
        <h2>Bilans szczegółowy całościowy</h2>
        <Chart type="bar" :data="categoriesTotalIncomeExpense" style="width: 100%; height:500px;"
               :options="stackedCurrencyOptions"/>
      </div>
      <div class="card card-chart">
        <h2>Bilans przychodów szczegółowy</h2>
        <Chart type="bar" :data="categoriesExpenseIncome.incomesBar" style="width: 100%; height:500px;"
               :options="currencyOptions"/>
      </div>
      <div class="card card-chart">
        <h2>Bilans wydatków szczegółowy</h2>
        <Chart type="bar" :data="categoriesExpenseIncome.expansesBar" style="width: 100%; height:500px;"
               :options="currencyOptions"/>
      </div>

      <div class="card card-chart">
        <h2>Bilans kategorii według daty</h2>
        <Chart type="bar" :data="categoriesDates" style="width: 100%; height:500px;" :options="stackedCurrencyOptions"/>
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

.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
}
</style>