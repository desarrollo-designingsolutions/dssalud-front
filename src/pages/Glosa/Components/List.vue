<script setup lang="ts">
import ModalForm from "@/pages/Glosa/Components/ModalForm.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();

const props = defineProps({
  service_id: {
    type: String,
  },
  total_value: {
    type: String,
  }
})

//TABLE
const refTableFull2 = ref()

const optionsTable = {
  url: "/glosa/paginate",
  headers: [
    { key: 'user_full_name', title: 'Usuario' },
    { key: 'service_description', title: 'Servicio' },
    { key: 'code_glosa_description', title: 'Código de glosa' },
    { key: 'glosa_value', title: 'Valor' },
    { key: 'observation', title: 'Observación' },
    { key: 'actions', title: 'Acciones' },
  ],
  paramsGlobal: {
    service_id: props.service_id
  },
  actions: {
    delete: {
      url: '/glosa/delete'
    }
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

//ModalForm
const refModalForm = ref()

const openModalFormCreate = () => {
  refModalForm.value.openModal({ service_id: props.service_id, total_value: props.total_value })
}

const openModalFormEdit = async (data: any) => {
  refModalForm.value.openModal({ service_id: props.service_id, id: data.id, total_value: props.total_value })
}

const openModalFormView = async (data: any) => {
  refModalForm.value.openModal({ service_id: props.service_id, id: data.id, total_value: props.total_value }, true)
}

const tableLoading = ref(false); // Estado de carga de la tabla 
const disableUrlSync = ref(true); // Controla si se sincroniza la URL


// Método para refrescar los datos
const refreshTable = (queries: any) => {
  if (refTableFull2.value) {
    refTableFull2.value.fetchTableData(
      null,        // page (null para usar la página actual)
      false,       // fromWatch
      true,        // force (forzar la petición)
      disableUrlSync.value, // skipUrlUpdate
      queries      // externalParams
    );
  }
};

</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Glosas
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="openModalFormCreate()">
            Crear Glosa
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading"
          :disable-url-sync="disableUrlSync">
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull2" :options="optionsTable" @edit="openModalFormEdit" @view="openModalFormView"
          @update:loading="tableLoading = $event">

        </TableFullNew>

      </VCardText>
    </VCard>
    <ModalForm ref="refModalForm" @execute="refreshTable"></ModalForm>
  </div>
</template>
