<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  name: "InvoiceAuditAssignmentBatche-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "invoiceAuditAssignmentBatche.list",
  },
});

const authenticationStore = useAuthenticationStore();

const router = useRouter();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/invoiceAudit/paginateBatche",
  headers: [
    { key: 'description', title: 'Descripcion' },
    { key: 'count_invoice', title: 'Facturas Totales', sortable: false },
    { key: 'count_invoice_pending', title: 'Facturas Pendientes', sortable: false },
    { key: 'count_invoice_completed', title: 'Facturas Completadas', sortable: false },
    // { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    delete: { url: '/assignmentBatche/delete' }
  },
  paramsGlobal: {
    user_id: authenticationStore.user.id,
    company_id: authenticationStore.company.id,
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewThirds = (data: { id: number | null } = { id: null }) => {

  router.push({ name: "InvoiceAuditAssignment-List", params: { assignment_batch_id: data.id } })

}

</script>

<template>

  <CountAllData :user_id="authenticationStore.user.id" />

  <VRow>
    <VCol>

      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <span>
            Auditorias
          </span>
        </VCardTitle>

        <VCardText>
          <FilterDialogNew :options-filter="optionsFilter">
          </FilterDialogNew>
        </VCardText>

        <VCardText class="mt-2">
          <TableFullNew ref="refTableFull" :options="optionsTable">

            <template #item.description="{ item }">
              <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
                {{ item.description }}
              </div>
            </template>

            <template #item.count_invoice="{ item }">
              <div style="cursor: pointer;" @click="goViewThirds({ id: item.id })">
                {{ item.count_invoice }}
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
    </VCol>
  </VRow>
</template>
