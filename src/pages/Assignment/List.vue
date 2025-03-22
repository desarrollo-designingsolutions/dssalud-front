<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "assignmentList/:assignment_batche_id?",
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
  url: "/assignment/paginateThirds/" + route.params.assignment_batche_id,
  headers: [
    { key: 'nit', title: 'Nit' },
    { key: 'name', title: 'Razón Social' },
    { key: 'count_invoice_assignment', title: 'Cant Fact Asignadas' },
    { key: 'count_invoice_pending', title: 'Cant Fact Pendientes' },
    { key: 'count_invoice_finish', title: 'Finalizar' },
    { key: 'values', title: 'Valores' },
    // { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    delete: { url: '/assignment/delete' }
  },
  paramsGlobal: {
    assignment_batche_id: route.params.assignment_batche_id,
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewInvoiceAudit = (data: any = { id: null }) => {

  router.push({ name: "AssignmentInvoiceAudit-List", params: { assignment_batche_id: route.params.assignment_batche_id, third_id: data.id } })

}

const goViewAssignmentBatchesList = () => {

  router.push({ name: "AssignmentBatche-List" })

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
          Prestadores
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewAssignmentBatchesList">
            Regresar
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @update:loading="tableLoading = $event">

          <template #item.nit="{ item }">
            <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
              {{ item.nit }}
            </div>
          </template>

          <template #item.name="{ item }">
            <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
              {{ item.name }}
            </div>
          </template>

          <template #item.count_invoice_assignment="{ item }">
            <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
              {{ item.count_invoice_assignment }}
            </div>
          </template>

          <template #item.count_invoice_pending="{ item }">
            <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
              {{ item.count_invoice_pending }}
            </div>
          </template>

          <template #item.count_invoice_finish="{ item }">
            <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
              {{ item.count_invoice_finish }}
            </div>
          </template>

          <template #item.values="{ item }">
            <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
              {{ item.values }}
            </div>
          </template>

        </TableFullNew>
      </VCardText>
    </VCard>
  </div>
</template>
