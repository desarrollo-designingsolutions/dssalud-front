<script setup lang="ts">
const titleModal = ref<string>("Errores en la validación")
const isDialogVisible = ref<boolean>(false)
const loading = reactive({
  excel: false,
  getData: false,
})

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const objData = ref()
const openModal = async (element: any) => {
  handleDialogVisible();
  objData.value = element
  init()
};

defineExpose({
  openModal,
})

const errorMessages = ref([]);

const init = async () => {
  errorMessages.value = []
  loading.getData = true
  const { data, response } = await useApi(`/filingInvoice/showErrorsValidation/${objData.value.id}`).get()
  if (response.value?.ok && data.value) {
    errorMessages.value = data.value.errorMessages
  }

  loading.getData = false
}


// headers
const inputsTableFilter = [
  { title: 'Columna', key: 'column' },
  { title: 'Fila', key: 'row' },
  { title: 'Valor', key: 'value' },
  // { title: 'Data', key: 'data' },
  { title: 'Errors', key: 'errors' },
]

const options = ref({ page: 1, itemsPerPage: 10, sortBy: [''], sortDesc: [false] })
const search = ref('')

const downloadExcel = async () => {
  loading.excel = true;
  const { data, response } = await useApi("/filingInvoice/excelErrorsValidation").post({
    id: objData.value.id,
  })

  loading.excel = false;

  if (response.value?.ok && data.value) {
    downloadExcelBase64(data.value.excel, "Lista de errores de validación")
  }
}
</script>

<template>
  <div>
    <VDialog v-model="isDialogVisible" :overlay="false" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />

      <VCard :loading="loading.getData" :disabled="loading.getData" class="w-100">
        <!-- Toolbar -->
        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>

        <VCardText>
          <VRow>
            <VCol cols="12" sm="6">
              <AppTextField v-model="search" density="compact" placeholder="Search ..."
                append-inner-icon="tabler-search" single-line hide-details dense outlined clearable />
            </VCol>
            <VCol cols="12" sm="6" class="d-flex justify-end">
              <VBtn :loading="loading.excel" :disabled="loading.excel" @click="downloadExcel">Exportar a Excel</VBtn>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <VDataTable :search="search" :headers="inputsTableFilter" :items="errorMessages"
            :items-per-page="options.itemsPerPage" :page="options.page" :options="options">

          </VDataTable>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn :loading="loading.getData" color="secondary" variant="tonal" @click="handleDialogVisible()">
            Cerrar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
