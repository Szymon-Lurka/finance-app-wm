<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { raportsService } from '@/api/services/raports';
import type { FinancialEntryType } from '@/types/types/FinancialEntry';

export default defineComponent({
  setup() {
    const balanceTotalAmount = ref(0);
    const balanceEntries = ref();
    const balanceExpensesAmount = ref(0);
    const balanceIncomesAmount = ref(0);
    const balanceExpensesEntries = ref();
    const balanceIncomesEntries = ref();

    const categoriesExpenses = ref({});
    const categoriesIncomes = ref({});
    const categoriesCombined = ref({});

    const categoriesAmountByDates = ref([]);

    const createDataForChart = (entries, dataSet) => {
      entries.value.forEach((entry) => {
        if (!entry.categories) {
          if (!dataSet.value['none']) {
            dataSet.value['none'] = {
              name: null,
              amount: entry.amount,
              color: 'black',
            };
          } else {
            dataSet.value['none'].amount += entry.amount;
          }
        } else {
          if (!dataSet?.value?.[entry.categories._id]) {
            dataSet.value[entry.categories._id] = {
              name: entry.categories.name,
              color: entry.categories.color,
              amount: entry.amount,
            };
          } else {
            dataSet.value[entry.categories._id].amount += entry.amount;
          }
        }
      });
    };

    const diffChartData = computed(() => ({
      labels: ['WYDATKI', 'PRZYCHODY'],
      datasets: [
        {
          data: [balanceExpensesAmount.value, balanceIncomesAmount.value],
          backgroundColor: ['#c44755', '#3fba8d'],
        },
      ],
    }));

    const categoriesChartData = computed(() => ({
      labels: Object.values(categoriesCombined.value).map((item) =>
        item.name ? item.name : 'Bez kategorii'
      ),
      datasets: [
        {
          data: Object.values(categoriesCombined.value).map((item) => item.amount),
          backgroundColor: Object.values(categoriesCombined.value).map((item) => item.color),
        },
      ],
    }));

    const categoriesExpensesChartData = computed(() => ({
      labels: Object.values(categoriesExpenses.value).map((item) =>
        item.name ? item.name : 'Bez kategorii'
      ),
      datasets: [
        {
          data: Object.values(categoriesExpenses.value).map((item) => item.amount),
          backgroundColor: Object.values(categoriesExpenses.value).map((item) => item.color),
        },
      ],
    }));

    const categoriesIncomesChartData = computed(() => ({
      labels: Object.values(categoriesIncomes.value).map((item) =>
        item.name ? item.name : 'Bez kategorii'
      ),
      datasets: [
        {
          data: Object.values(categoriesIncomes.value).map((item) => item.amount),
          backgroundColor: Object.values(categoriesIncomes.value).map((item) => item.color),
        },
      ],
    }));

    const stackedBarConfig = {
      labels: ['2023-02-02', '2023-02-03', '2023-02-02', '2023-02-03', '2023-02-02', '2023-02-03'],
      datasets: [
        {
          label: 'KAtegoria 1',
          data: [145, 42, 42, 5, 63, 1, 3],
          backgroundColor: 'red',
          stack: 'Stack 0',
        },
        {
          label: 'KAtegoria 2',
          data: [-242, -502, 4, 564, 523, 1],
          backgroundColor: 'yellow',
          stack: 'Stack 1',
        },
        {
          label: 'KAtegoria 3',
          data: [600, -212, 45, 23, -523, 2],
          backgroundColor: 'green',
          stack: 'Stack 2',
        },
        {
          label: 'KAtegoria 3',
          data: [110, -25, 45, 23, -523, 2],
          backgroundColor: 'gray',
          stack: 'Stack 3',
        },
        {
          label: 'KAtegoria 3',
          data: [50, -245, 45, 23, -523, 2],
          backgroundColor: 'blue',
          stack: 'Stack 4',
        },
      ],
    };

    const getExpensesFromDiff = (diffEntries: any[], type: FinancialEntryType): number => {
      if (!diffEntries || (diffEntries.length && diffEntries.length < 1)) return 0;
      const entry = diffEntries.find((entry) => entry._id === type);
      if (!entry) return 0;
      return entry.totalAmount;
    };
    const fetchBalance = async () => {
      try {
        const { data } = await raportsService.getBalance();
      } catch (e) {
        console.log(e);
      }
    };

    const setChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      return {
        tooltip: {
          enabled: false,
          titleColor: 'red',
        },
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      };
    };
    onMounted(async () => {
      await fetchBalance();
    });
    return {
      diffChartData,
      setChartOptions,
      categoriesChartData,
      categoriesExpensesChartData,
      categoriesIncomesChartData,
      balanceTotalAmount,
      balanceExpensesAmount,
      balanceIncomesAmount,
      stackedBarConfig,
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
            <span class="block-text-500 font-medium mb-3">Twój bilans z ostatniego tygodnia</span>
            <div class="text-900 font-medium text-xl">{{ balanceTotalAmount }} zł</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">W ostatnim tygodniu wydałeś</span>
            <div class="text-900 font-medium text-xl">{{ Math.abs(balanceExpensesAmount) }} zł</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">Na twoje konto wpłynęło</span>
            <div class="text-900 font-medium text-xl">{{ balanceIncomesAmount }} zł</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block-text-500 font-medium mb-3">Najwięcej wydałeś w kategorii</span>
            <div class="text-900 font-medium text-xl">XYZ</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 text-xl" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card card-chart">
        <h2>Dochody</h2>
        <Chart type="pie" :data="diffChartData" :plugins="setChartOptions" />
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card card-chart">
        <h2>Dochody w kategoriach</h2>
        <Chart type="doughnut" :data="categoriesChartData" :plugins="setChartOptions" />
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card card-chart">
        <h2>Dochody w kategoriach</h2>
        <Chart type="doughnut" :data="categoriesChartData" :plugins="setChartOptions" />
      </div>
    </div>
    <div class="col-12 xl:col-12">
      <div class="card card-chart">
        <h2>Wydatki w kategoriach</h2>
        <Chart type="bar" style="width: 100%" :data="stackedBarConfig" :plugins="setChartOptions" />
      </div>
      <div class="card card-chart">
        <h2>Przychody w kategoriach</h2>
        <Chart type="pie" :data="categoriesIncomesChartData" :plugins="setChartOptions" />
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