<script setup lang="ts">
const emit = defineEmits(["execute"])

const titleModal = ref<string>("Listado de errores")
const isDialogVisible = ref<boolean>(false)
const batch_id = ref<string>("")
const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};


//TABLE
const refTableFull = ref()

const optionsTable = ref({
  url: "/glosa/paginate",
  headers: [
    { key: 'error_type', title: 'Tipo de error' },
    { key: 'column', title: 'Columna' },
    { key: 'row', title: 'Fila' },
    { key: 'value', title: 'Valor' },
    { key: 'message', title: 'Mensaje' },
  ],
  paramsGlobal: {
    batch_id: batch_id.value
  },
})

//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const tableLoading = ref(false); // Estado de carga de la tabla

// Nueva prop para controlar si se actualiza la URL
const disableUrlUpdate = ref(true);

// Nuevo método para manejar la búsqueda forzada desde el filtro
const handleForceSearch = (params: any) => {
  if (refTableFull.value) {
    // Si disableUrlUpdate está activo, pasamos los parámetros manualmente
    if (disableUrlUpdate.value && params) {
      refTableFull.value.fetchTableData(null, false, true, params);
    } else {
      refTableFull.value.fetchTableData(null, false, true);
    }
  }
};

const openModal = async (batchId: string) => {
  handleDialogVisible();
  batch_id.value = batchId
};

defineExpose({
  openModal
})


</script>

<template>
  <div>
    <VDialog v-model="isDialogVisible" max-width="70rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard class="w-100">
        <!-- Toolbar -->

        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>

        <VCardText>
          <FilterDialogNew :options-filter="optionsFilter" @force-search="handleForceSearch"
            :table-loading="tableLoading" :disable-url-update="disableUrlUpdate">
          </FilterDialogNew>
        </VCardText>

        <VCardText>
          <TableFullNew ref="refTableFull" :options="optionsTable" @update:loading="tableLoading = $event"
            :disable-url-update="disableUrlUpdate">
          </TableFullNew>
        </VCardText>
      </VCard>
    </VDialog>

  </div>
</template>
