<script setup>
import { computed, onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { DataPiutangService } from '@/utils/data';

const visible = ref(false);
const dataPiutang = ref();
const piutang = ref();

const columns = [
  { field: 'pemilik', header: 'Pemilik', style: '12' },
  { field: 'peserta', header: 'Peserta', style: '12' },
  { field: 'va', header: 'Nomor VA', style: '12' },
  { field: 'hargaTerbentuk', header: 'Harga Terbentuk (Rp)', style: '12' },
  { field: 'biayaAdmin', header: 'Biaya Admin ex PPN (Rp)', style: '16' },
  { field: 'ppn', header: 'PPN (Rp)', style: '16' },
  { field: 'total', header: 'Total (Rp)', style: '12' },
];

// Checkbox select
const selectedProduct = ref([]);
const CheckboxSelected = computed(() => {
  return selectedProduct.value.length > 0;
});

// CSV Export
function exportCSV() {
  const selectedData = selectedProduct.value.length > 0
    ? piutang.value.filter(customer => selectedProduct.value.includes(customer))
    : piutang.value;

  const exportData = convertDataForExport(selectedData);

  dataPiutang.value.exportCSV({
    selectionOnly: selectedProduct.value.length > 0,
    customData: exportData,
    fileName: 'data-piutang-unit.csv',
  });
}

// Mapping
function convertDataForExport(data) {
  return data.map((item) => {
    return {
      'No Kewajiban': item.nomor.kewajiban,
      'No Polisi': item.nomor.polisi,
      'Pemilik': item.pemilik,
      'Peserta': item.peserta,
      'Nomor VA': item.va,
      'Harga Terbentuk (Rp)': item.hargaTerbentuk,
      'Biaya Admin ex PPN (Rp)': item.biayaAdmin,
      'PPN (Rp)': item.ppn,
      'Total (Rp)': item.total,
      'Tanggal Lelang': item.tanggal.lelang,
      'Tanggal Jatuh Tempo': item.tanggal.jatuhTempo,
      'Tanggal Lunas': item.tanggal.lunas,
      'Status': item.status,
    };
  });
}

// Bayar
function bayar() {
  if (selectedProduct.value.length === 0)
    return;

  selectedProduct.value.forEach((customer) => {
    customer.status = 'LUNAS';
    customer.tanggal.lunas = new Date().toLocaleDateString();
  });

  dataPiutang.value = [...piutang.value];
  localStorage.setItem('data', JSON.stringify(piutang.value));
  selectedProduct.value = [];
}

// Refresh
async function refreshTable() {
  const newData = await DataPiutangService.getDataPiutangXLarge();
  piutang.value = newData;
  localStorage.setItem('data', JSON.stringify(newData));
}

// **PRIME VUE**

// Filter for table
const filters = ref();

function clearFilter() {
  initFilters();
}

function initFilters() {
  filters.value = {
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'nomor.kewajiban': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'nomor.polisi': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'pemilik': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'peserta': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'va': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'hargaTerbentuk': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'biayaAdmin': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'ppn': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'total': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'tanggal.lelang': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'tanggal.jatuhTempo': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'tanggal.lunas': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    'status': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  };
}

initFilters();

// Status badge color
function getSeverity(status) {
  switch (status) {
    case 'PROSES':
      return 'danger';

    case 'LUNAS':
      return 'success';

    case 'KONFIRMASI':
      return 'info';
  }
}

// **STOP* **PRIME VUE**

// GET DATA
onMounted(() => {
  const localStorageData = localStorage.getItem('data');
  if (localStorageData) {
    piutang.value = JSON.parse(localStorageData);
  }
  else {
    DataPiutangService.getDataPiutangXLarge().then((data) => {
      piutang.value = data;
    });
  }
});
</script>

<template>
  <DataTable
    ref="dataPiutang"
    v-model:filters="filters"
    v-model:selection="selectedProduct"
    :value="piutang" data-key="id"
    :rows="10"
    :rows-per-page-options="[5, 10, 20, 50]"
    :global-filter-fields="['nomor.kewajiban', 'nomor.polisi', 'pemilik', 'peserta', 'va', 'hargaTerbentuk', 'biayaAdmin', 'ppn', 'total', 'tanggal.lelang', 'tanggal.jatuhTempo', 'tanggal.lunas', 'status']"
    filter-display="menu" table-style="min-width: 50rem" show-gridlines paginator
    state-storage="session" state-key="dt-state-demo-session"
    paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    current-page-report-template="{first} to {last} of {totalRecords}"
  >
    <template #header>
      <div id="table-nav">
        <div id="box">
          <Button icon="pi pi-cloud-download" label="CSV Export" rounded :disabled="!CheckboxSelected" @click="exportCSV($event)" />
          <Button icon="pi pi-wallet" label="Bayar" severity="info" rounded :disabled="!CheckboxSelected" @click="visible = true" />
          <Dialog v-model:visible="visible" modal header="Anda yakin ingin bayar?" :style="{ width: '25rem' }">
            <div id="dialog-box-button">
              <Button type="button" label="Batalkan" severity="secondary" @click="visible = false" />
              <Button type="button" label="Bayar" @click="bayar(visible = false)" />
            </div>
          </Dialog>
        </div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters.global.value" placeholder="Kata Kunci" />
        </span>
        <div id="box">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <Button icon="pi pi-refresh" severity="contrast" @click="refreshTable" />
        </div>
      </div>
    </template>
    <template #empty>
      Data tidak ada
    </template>
    <template #paginatorstart />
    <Column selection-mode="multiple" />
    <Column field="nomor.kewajiban" header="No. Kewajiban" style="min-width: 12rem" sortable>
      <template #body="{ data }">
        {{ data.nomor.kewajiban }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Cari pemilik" />
      </template>
    </Column>
    <Column field="nomor.polisi" header="No. Polisi" style="min-width: 12rem" sortable>
      <template #body="{ data }">
        {{ data.nomor.polisi }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Cari pemilik" />
      </template>
    </Column>
    <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header" :style="`min-width:${column.style}rem`" sortable>
      <template #body="{ data }">
        {{ data[column.field] }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="`Cari ${column.header}`" />
      </template>
    </Column>
    <Column field="tanggal.lelang" header="Tanggal Lelang" style="min-width: 12rem" sortable>
      <template #body="{ data }">
        {{ data.tanggal.lelang }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Cari Tanggal Lelang" />
      </template>
    </Column>
    <Column field="tanggal.jatuhTempo" header="Tanggal Jatuh Tempo" style="min-width: 12rem" sortable>
      <template #body="{ data }">
        {{ data.tanggal.jatuhTempo }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Cari Tanggal Jatuh Tempo" />
      </template>
    </Column>
    <Column field="tanggal.lunas" header="Tanggal Lunas" style="min-width: 12rem" sortable>
      <template #body="{ data }">
        {{ data.tanggal.lunas }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Cari Tanggal Lunas" />
      </template>
    </Column>
    <Column field="status" header="Status" sortable>
      <template #body="props">
        <Tag :value="props.data.status" :severity="getSeverity(props.data.status)" />
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Cari Status" />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
#table-nav, #box, #dialog-box-button {
  display: flex;
  gap: 1rem;
}
#table-nav {
  justify-content: space-between;
  flex-wrap: wrap;
}
#dialog-box-button {
  justify-content: flex-end;
}
</style>
