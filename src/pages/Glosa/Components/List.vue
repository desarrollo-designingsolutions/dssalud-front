<script setup lang="ts">
import ModalForm from "@/pages/Glosa/Components/ModalForm.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();

const props = defineProps({
  service_id: {
    type: String,
  }
})

//TABLE
const refTableFull = ref()

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
  refModalForm.value.openModal({ service_id: props.service_id })
}

const openModalFormEdit = async (data: any) => {
  refModalForm.value.openModal({ service_id: props.service_id, id: data.id })
}

const openModalFormView = async (data: any) => {
  refModalForm.value.openModal({ service_id: props.service_id, id: data.id }, true)
}

const tableLoading = ref(false); // Estado de carga de la tabla

// Método para refrescar los datos
const refreshTable = () => {
  if (refTableFull.value) {
    refTableFull.value.fetchTableData(null, false, true); // Forzamos la búsqueda
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
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="openModalFormEdit" @view="openModalFormView"
          @update:loading="tableLoading = $event">

        </TableFullNew>

      </VCardText>
    </VCard>
    <ModalForm ref="refModalForm" @execute="refreshTable"></ModalForm>
  </div>
</template>
