<script setup lang="ts">
import ModalForm from '@/pages/AssignmentBatche/Components/ModalForm.vue';
import ModalUploadFileCsv from "@/pages/AssignmentBatche/Components/ModalUploadFileCsv.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "assignment/:id?",
  name: "Assignment-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "assignmentBatche.list",
  },
});

const authenticationStore = useAuthenticationStore();

const router = useRouter();

const route = useRoute();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/assignment/paginate/"+route.params.id,
  headers: [
    { key: 'nit', title: 'Nit' },
    { key: 'name', title: 'Razón Social' },
    { key: 'count_invoice_assignment', title: 'Cant Fact Asignadas' },
    { key: 'count_invoice_pending', title: 'Cant Fact Pendientes' },
    { key: 'finish', title: 'Finalizar' },
    { key: 'values', title: 'Valores' },
    // { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    delete: { url: '/assignment/delete' }
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

router.push({ name: "Assignment-List", params: { id: data.id } })

}

</script>

<template>
<div>

  <VCard>
    <VCardTitle class="d-flex justify-space-between">
      <span>
        Prestadores
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

        <template #item.assignment_date="{ item }">
          <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
            {{ item.assignment_date }}
          </div>
        </template>

        <template #item.pending_date="{ item }">
          <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
            {{ item.pending_date }}
          </div>
        </template>

        <template #item.completed_date="{ item }">
          <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
            {{ item.completed_date }}
          </div>
        </template>

      </TableFullNew>
    </VCardText>
  </VCard>

  <ModalUploadFileCsv ref="refModalUploadFileCsv" />

  <ModalForm ref="refModalForm" @execute="reloadTable" />
</div>
</template>
