<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "assignment/invoice-audit/:assignment_batch_id/:third_id",
  name: "AssignmentInvoiceAudit-List",
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
  url: `/assignment/paginateInvoiceAudit/${route.params.assignment_batch_id}/${route.params.third_id}`,
  headers: [
    { key: 'invoice_number', title: 'Factura' },
    { key: 'count_patients', title: 'Cantidad Usuarios', sortable: false },
    { key: 'count_services', title: 'Cant Servicios', sortable: false },
    { key: 'total_value', title: 'Valor Factura', sortable: false },
    { key: 'glosas', title: 'Glosas', sortable: false },
    { key: 'value_glosa', title: 'Valor Glosado', sortable: false },
    { key: 'spent', title: 'Valor Aprovado', sortable: false },
    { key: 'status', title: 'Estado', sortable: false },
    { key: 'user_names', title: 'Usuarios' },
    // { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    delete: { url: '/assignment/delete' }
  },
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewPatients = (data: any = { id: null }) => {
  router.push({ name: "AssignmentPatient-List", params: { assignment_batch_id: route.params.assignment_batch_id, third_id: route.params.third_id, invoice_audit_id: data.id } })
}

const goViewAssignmentList = () => {
  router.push({ name: "Assignment-List", params: { assignment_batch_id: route.params.assignment_batch_id } })
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

  <CountAllData :assignment_batch_id="route.params.assignment_batch_id" :third_id="route.params.third_id" />

  <VRow>
    <VCol>
      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <span>
            Facturas
          </span>

          <div class="d-flex justify-end gap-3 flex-wrap ">
            <VBtn @click="goViewAssignmentList">
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

            <template #item.invoice_number="{ item }">
              <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                {{ item.invoice_number }}
              </div>
            </template>

            <template #item.count_patients="{ item }">
              <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                {{ item.count_patients }}
              </div>
            </template>

            <template #item.count_services="{ item }">
              <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                {{ item.count_services }}
              </div>
            </template>

            <template #item.total_value_services="{ item }">
              <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                {{ item.total_value_services }}
              </div>
            </template>

            <template #item.glosas="{ item }">
              <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                {{ item.glosas }}
              </div>
            </template>

            <template #item.value_glosa="{ item }">
              <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                {{ item.value_glosa }}
              </div>
            </template>

            <template #item.spent="{ item }">
              <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                {{ item.spent }}
              </div>
            </template>

            <template #item.status="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ getInvoiceAuditStatus(item.status).title }}
                </div>
              </template>

          </TableFullNew>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
