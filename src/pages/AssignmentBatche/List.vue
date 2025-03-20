<script setup lang="ts">
import ModalForm from '@/pages/AssignmentBatche/Components/ModalForm.vue';
import ModalUploadFileCsv from "@/pages/AssignmentBatche/Components/ModalUploadFileCsv.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  name: "AssignmentBatche-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "assignmentBatche.list",
  },
});

const authenticationStore = useAuthenticationStore();

const router = useRouter();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/assignmentBatche/paginate",
  headers: [
    { key: 'description', title: 'Descripcion' },
    { key: 'count_invoice_assignment', title: 'Facturas Asignadas' },
    { key: 'count_invoice_pending', title: 'Facturas Pendientes' },
    { key: 'count_invoice_completed', title: 'Facturas Completadas' },
    // { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    delete: { url: '/assignmentBatche/delete' }
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

//ModalForm
const refModalForm = ref()

const openModalForm = () => {
  refModalForm.value.openModal()
}

const goViewEdit = async (data: any) => {
  refModalForm.value.openModal(data.id)
}

const goViewView = async (data: any) => {
  refModalForm.value.openModal(data.id, true)
}

const reloadTable = () => {
  refTableFull.value.fetchTableData()

}

//ModalUploadFileCsv
const refModalUploadFileCsv = ref()
const openModalUploadFileCsv = () => {
  refModalUploadFileCsv.value.openModal()
}

const goViewThirds = (data: { id: number | null } = { id: null }) => {

  router.push({ name: "Assignment-List", params: { assignment_batche_id: data.id } })

}

</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Auditorias
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <ProgressCircularChannel :channel="'assignment.' + authenticationStore.user.id"
            tooltipText="Cargando asignaciones" />
          <VBtn @click="openModalUploadFileCsv()">
            Importar Csv
          </VBtn>
          <VBtn @click="openModalForm()">
            Crear Paquete
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit" @view="goViewView">

          <template #item.description="{ item }">
            <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
              {{ item.description }}
            </div>
          </template>

          <template #item.count_invoice_assignment="{ item }">
            <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
              {{ item.count_invoice_assignment }}
            </div>
          </template>

          <template #item.count_invoice_pending="{ item }">
            <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
              {{ item.count_invoice_pending }}
            </div>
          </template>

          <template #item.count_invoice_completed="{ item }">
            <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
              {{ item.count_invoice_completed }}
            </div>
          </template>

        </TableFullNew>
      </VCardText>
    </VCard>

    <ModalUploadFileCsv ref="refModalUploadFileCsv" />

    <ModalForm ref="refModalForm" @execute="reloadTable" />
  </div>
</template>
